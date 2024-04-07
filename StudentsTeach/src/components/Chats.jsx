import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthC";
import { ChatContext } from "../context/ChatC";
import { db } from "../firebase";
import { collection, getDocs, query, onSnapshot, doc, getDoc, setDoc} from "firebase/firestore";

import pinicon from "../img/pin.png"

const Chats = () => {
  const [servers, setServers] = useState([]);
  const [chats, setChats] = useState([]);
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
    const unsubscribe = onSnapshot(collection(db, "serverChats"), (snapshot) => {
      const serverData = [];
      snapshot.forEach((doc) => {
        const server = {
          id: doc.id,
          ...doc.data(),
        };
        const lastMessage = server.lastMessage ? {
          ...server.lastMessage,
          date: server.lastMessage.date.toDate(),
        } : null;
        serverData.push({ ...server, lastMessage });
      });
      setServers(serverData);
    });
  
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    const getServers = async () => {
      try {
        const q = query(collection(db, "serverChats"));
        const querySnapshot = await getDocs(q);
        const serverDataPromises = querySnapshot.docs.map(async (doc) => {
          const server = {
            id: doc.id,
            ...doc.data(),
          };
          const lastMessage = server.lastMessage ? {
            ...server.lastMessage,
            date: server.lastMessage.date.toDate(),
          } : null;
          return { ...server, lastMessage };
        });
        const serverData = await Promise.all(serverDataPromises);
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

  const handleDeleteChat = async (chatId) => {
    try {
      const userChatsDocRef = doc(db, "userChats", currentUser.uid);
      const userChatsDoc = await getDoc(userChatsDocRef);
      const userChatsData = userChatsDoc.data();
      if (userChatsData && userChatsData[chatId]) {
        const otherUserId = userChatsData[chatId].userInfo.uid;
        const otherUserChatsDocRef = doc(db, "userChats", otherUserId);
        const otherUserChatsDoc = await getDoc(otherUserChatsDocRef);
        const otherUserChatsData = otherUserChatsDoc.data();
        if (otherUserChatsData && otherUserChatsData[chatId]) {
          delete userChatsData[chatId];
          await setDoc(userChatsDocRef, userChatsData);
          delete otherUserChatsData[chatId];
          await setDoc(otherUserChatsDocRef, otherUserChatsData);
        }
      }
      const chatDocRef = doc(db, "chats", chatId);
      await deleteDoc(chatDocRef);
      console.log("Chat deleted successfully.");
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handlePinChat = async (chatId) => {
    try {
      const userChatsRef = doc(db, "userChats", currentUser.uid);
      const userChatsDoc = await getDoc(userChatsRef);
      const userChatsData = userChatsDoc.data();
      const updatedChats = {
        ...userChatsData,
        [chatId]: {
          ...userChatsData[chatId],
          pinned: !userChatsData[chatId]?.pinned
        }
      };
      await setDoc(userChatsRef, updatedChats);
      setChats(updatedChats);
    } catch (error) {
      console.error("Error pinning chat:", error);
    }
  };

  return (
    <div className="chats">
      <p className="dm">DM's</p>
      <div className="user-chats">
        {chats && Object.entries(chats)
          .sort((a, b) => {
            if (a[1]?.pinned && !b[1]?.pinned) return -1;
            if (!a[1]?.pinned && b[1]?.pinned) return 1;
            return b[1]?.date - a[1]?.date;
          })
          .map((chat) => (
            chat[1]?.userInfo && chat[1]?.userInfo.uid !== currentUser.uid && (
              <div
                className={`userChat ${chat[1]?.pinned ? 'pin' : ''}`}
                key={chat[0]}
                onClick={() => handleSelect(chat[1]?.userInfo)}
              >
                <>
                  <img
                    src={chat[1]?.userInfo.photoURL}
                    alt=""
                    className="icon"
                  />
                  <span>{chat[1]?.userInfo.displayName}</span>
                  <p>{chat[1]?.lastMessage?.text}</p>
                  <div className="userChatInfo">
                    <button onClick={() => handleDeleteChat(chat[0])}>Delete</button>
                    <button onClick={() => handlePinChat(chat[0])}><img src={pinicon}  className="pin-img" alt='Pin'></img></button>
                   
                  </div>
                </>
              </div>
            )
          ))}
      </div>
      <hr className="chat-divider" />
      <p className="gc">Group chats</p>
      <div className="server-chats">
        {servers.map((server) => (
          <div
            className="server, userChat"
            key={server.id}
            onClick={() => handleSelectServer(server)}
          >
          {server.icon && <img src={server.icon} alt="Server Icon" className="icon" />}
            <span>{server.name}</span>
            <p>{server.lastMessage ? server.lastMessage.text || 'No messages' : 'No messages'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
