import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthC";
import { ChatContext } from "../context/ChatC";
import { db, storage } from "../firebase";
import { doc, onSnapshot, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage"; // Import ref and getDownloadURL

const Chats = () => {
  const [servers, setServers] = useState([]);
  const [chats, setChats] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the popup

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  useEffect(() => {
    const getServers = async () => {
      try {
        const q = query(collection(db, "servers"), where('members', 'array-contains', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const serverData = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const server = { id: doc.id, ...doc.data() };
          // Fetch the server icon URL from Firebase Storage
          if (server.icon) {
            const iconRef = ref(storage, server.icon);
            const iconURL = await getDownloadURL(iconRef);
            server.iconURL = iconURL;
          }
          return server;
        }));
        setServers(serverData);
      } catch (error) {
        console.error("Error getting servers:", error);
      }
    };
  
    currentUser.uid && getServers();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  const handleSelectServer = (server) => {
    dispatch({ type: "CHANGE_SERVER", payload: server });
  };

  return (
    <div className="chats">
      <div className="user-chats">
        {chats && Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
            <img src={chat[1].userInfo.photoURL} alt="" className="icon" /> {/* Added class="icon" */}
            <div className="userChatInfo"></div>
          </div>
        ))}
      </div>
      <hr className="chat-divider" /> {/* Divider line */}
      <div className="server-chats">
        {servers.map((server) => (
          <div
            className="server, userChat"
            key={server.id}
            onClick={() => handleSelectServer(server)}
          >
            <span>{server.name}</span>
            {/* Render additional server information here */}
            {server.iconURL && <img src={server.iconURL} alt="Server Icon" className="icon" />} {/* Added class="icon" */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
