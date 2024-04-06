import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthC";
import { ChatContext } from "../context/ChatC";
import { db, storage } from "../firebase";
import { doc, onSnapshot, getDoc, collection, getDocs, query, where, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage"; 

const Chats = () => {
  const [servers, setServers] = useState([]);
  const [chats, setChats] = useState([]);
  const [showPopup, setShowPopup] = useState(false); 

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

 
    const handleDeleteChat = async (chatId) => {
      try {
        // Construct the document reference for the specific chat entry within userChats
        const userChatsDocRef = doc(db, "userChats", currentUser.uid);
    
        // Get the current user's userChats document data
        const userChatsDoc = await getDoc(userChatsDocRef);
        const userChatsData = userChatsDoc.data();
    
        // Check if the chat entry exists in the userChats data before proceeding
        if (userChatsData && userChatsData[chatId]) {
          // Get the userId of the other user in the chat
          const otherUserId = userChatsData[chatId].userInfo.uid;
    
          // Construct the document reference for the other user's userChats entry
          const otherUserChatsDocRef = doc(db, "userChats", otherUserId);
    
          // Get the other user's userChats document data
          const otherUserChatsDoc = await getDoc(otherUserChatsDocRef);
          const otherUserChatsData = otherUserChatsDoc.data();
    
          // Check if the chat entry exists in the other user's userChats data before proceeding
          if (otherUserChatsData && otherUserChatsData[chatId]) {
            // Delete the chat entry from the current user's userChats data
            delete userChatsData[chatId];
            await setDoc(userChatsDocRef, userChatsData);
    
            // Delete the chat entry from the other user's userChats data
            delete otherUserChatsData[chatId];
            await setDoc(otherUserChatsDocRef, otherUserChatsData);
          }
        }
    
        // Construct the document reference for the chat document within the chats collection
        const chatDocRef = doc(db, "chats", chatId);
    
        // Delete the chat document from the chats collection
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
    chat[1]?.userInfo && chat[1]?.userInfo.uid !== currentUser.uid && // Check if the chat user ID is different from the current user's ID
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
          <button onClick={() => handlePinChat(chat[0])}>Pin</button>
        </div>
      </>
    </div>
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
             {server.iconURL && <img src={server.iconURL} alt="Server Icon" className="icon" />}
            <span>{server.name}</span>
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
