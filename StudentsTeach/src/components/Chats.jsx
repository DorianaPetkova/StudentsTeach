import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthC";
import { ChatContext } from "../context/ChatC";
import { db } from "../firebase";
import { collection, getDocs, query, onSnapshot, doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import pinicon from "../img/pin.png";
import piniconB from "../img/black pin.png";

const Chats = () => {
  const [servers, setServers] = useState([]);
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  

  useEffect(() => {
    const getChats = async () => {
      try {
        const docRef = doc(db, "userChats", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setChats(docSnap.data());
        } else {
          console.log("No user chats found.");
        }
      } catch (error) {
        console.error("Error fetching user chats:", error);
      }
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      snapshot.forEach(doc => {
        const userData = doc.data();
        // Check if the user data matches the last opened chat's user
        if (chats && chats.lastOpenedChatId && chats[chats.lastOpenedChatId] && userData.uid === chats[chats.lastOpenedChatId].userInfo.uid) {
          setChats(prevChats => ({
            ...prevChats,
            [prevChats.lastOpenedChatId]: {
              ...prevChats[prevChats.lastOpenedChatId],
              userInfo: {
                displayName: userData.displayName,
                photoURL: userData.photoURL
              }
            }
          }));
        }
      });
    });
  
    return () => unsubscribe();
  }, [chats.lastOpenedChatId]);
  
  
  
  
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
  
      // Update local state to remove the deleted chat
      setChats((prevChats) => {
        const updatedChats = { ...prevChats };
        delete updatedChats[chatId];
        return updatedChats;
      });
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };
  

  const handleDeleteServer = async (serverId) => {
    try {
      
      const serverDocRef = doc(db, "servers", serverId);
      await deleteDoc(serverDocRef);
      console.log("Server deleted successfully.");
  
     
      const serverChatDocRef = doc(db, "serverChats", serverId);
      await deleteDoc(serverChatDocRef);
      console.log("Server chat deleted successfully.");
    } catch (error) {
      console.error("Error deleting server:", error);
    }
  };

  return (
    <div className="chats">
      <p className="dm">DM's</p>
      <div className="user-chats">
        {chats && Object.entries(chats).map((chat) => (
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
                  <button onClick={() => handlePinChat(chat[0])}><img src={chat[1]?.pinned ? pinicon : piniconB} alt='Pin' /></button>
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
            {server.creatorId === currentUser.uid && (
              <button onClick={() => handleDeleteServer(server.id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
