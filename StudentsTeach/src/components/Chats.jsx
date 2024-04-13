import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthC";
import { ChatContext } from "../context/ChatC";
import { db } from "../firebase";
import { 
  collection, 
  getDocs, 
  query, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  getDoc, 
  setDoc, 
  where 
} from "firebase/firestore";
import pinicon from "../img/pin.png";
import piniconB from "../img/black pin.png";

const Chats = () => {
  const [servers, setServers] = useState([]);
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [lastMessageTexts, setLastMessageTexts] = useState({});

  useEffect(() => {
    const getChats = async () => {
      try {
        const unsubscribe = onSnapshot(doc(db, "userChats", currentUser.uid), async (doc) => {
          setChats(doc.data());

          
          const lastMessageTexts = await fetchLastMessageTexts();
          setLastMessageTexts(lastMessageTexts); 

          // clean up
          return () => {
            unsubscribe();
          };
        });
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const fetchLastMessageTexts = async () => {
    try {
      const chatsCollectionRef = collection(db, "chats");
      const querySnapshot = await getDocs(chatsCollectionRef);
      const lastMessageTexts = {};
      querySnapshot.forEach((doc) => {
        const chatData = doc.data();
        const lastMessage = chatData.lastMessage;
        if (lastMessage && lastMessage.text) {
          lastMessageTexts[doc.id] = lastMessage.text;
        }
      });
      return lastMessageTexts;
    } catch (error) {
      console.error("Error fetching last message texts:", error);
      return {};
    }
  };

  const sortedChats = Object.entries(chats)
    .filter(([_, chat]) => chat.userInfo && chat.userInfo.uid !== currentUser.uid)
    .sort(([_, chatA], [__, chatB]) => {
      // sorting by the date 
      const lastMessageA = chatA.lastMessage;
      const lastMessageB = chatB.lastMessage;

      if (!lastMessageA && !lastMessageB) return 0;
      if (!lastMessageA) return 1;
      if (!lastMessageB) return -1;

      return lastMessageB.date - lastMessageA.date;
    });

  const handlePinChat = async (chatId) => {
    try {
      const userChatsRef = doc(db, "userChats", currentUser.uid);
      const userChatsDoc = await getDoc(userChatsRef);
      const userChatsData = userChatsDoc.data();
       // toggle the status for when we sort it 
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
       
        if (chats && chats.lastOpenedChatId && chats[chats.lastOpenedChatId] && userData.uid === chats[chats.lastOpenedChatId].userInfo.uid) {
          setChats(prevChats => ({
            ...prevChats,
            [prevChats.lastOpenedChatId]: {
              ...prevChats[prevChats.lastOpenedChatId],
              userInfo: {
                displayName: userData.displayName,
                photoURL: userData.photoURL,
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
        // we only query if the current user is a member
        const q = query(collection(db, "serverChats"), where("members", "array-contains", currentUser.uid));
        const unsubscribeServerChats = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach(change => {
            if (change.type === "modified") {
              const modifiedServer = {
                id: change.doc.id,
                ...change.doc.data(),
              };
              const lastMessage = modifiedServer.lastMessage ? {
                ...modifiedServer.lastMessage,
                date: modifiedServer.lastMessage.date.toDate(),
              } : null;
              setServers(prevServers => {
                const updatedServers = prevServers.map(server => {
                  if (server.id === modifiedServer.id) {
                    return {
                      ...server,
                      lastMessage: lastMessage,
                    };
                  } else {
                    return server;
                  }
                });
                return updatedServers;
              });
            }
          });
        });

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
        return unsubscribeServerChats;
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
      const confirmed = window.confirm("Are you sure you want to delete this chat?");
      if (confirmed) {
        // we retrieve the current user chat and the user we're chatting with so we can delete it from both collections
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
  
        
        setChats((prevChats) => {
          const updatedChats = { ...prevChats };
          delete updatedChats[chatId];
          return updatedChats;
        });
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };
  

  const handleDeleteServer = async (serverId) => {
    try {
      // the exact same as the chats - updating all users
      const confirmed = window.confirm("Are you sure you want to delete this server?");
      if (confirmed) {
      const serverDocRef = doc(db, "servers", serverId);
      await deleteDoc(serverDocRef);
      console.log("Server deleted successfully.");

      const serverChatDocRef = doc(db, "serverChats", serverId);
      await deleteDoc(serverChatDocRef);
      console.log("Server chat deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting server:", error);
    }
  };

  const truncateMessage = (message, maxLength) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  return (
    <div className="chats">
      <p className="dm">DM's</p>
      <div className="user-chats">
    {/*we sort the pinned, then the unpinned */}
        {Object.entries(chats)
          .filter(([_, chat]) => chat.userInfo && chat.userInfo.uid !== currentUser.uid && chat.pinned)
          .map(([chatId, chat]) => (
            <div
              className={`userChat ${chat.pinned ? 'pin' : ''}`}
              key={chatId}
              onClick={() => handleSelect(chat.userInfo)}
            >
              <>
                <img
                  src={chat.userInfo.photoURL}
                  alt=""
                  className="icon"
                />
                <div className="name-message">
                  <span className="no-marb">{chat.userInfo.displayName}</span>
                  <p className="messages-ch">{truncateMessage(lastMessageTexts[chatId] || 'No messages', 8)}</p>
                </div>
                <div className="userChatInfo">
                  <button className="btn delete" onClick={() => handleDeleteChat(chatId)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" className="bi bi-trash3" viewBox="0 0 16 16">
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                  </button>
                  <br />
                  <button className="btn pin" onClick={() => handlePinChat(chatId)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FF6D6D" className="bi bi-pin-fill" viewBox="0 0 16 16">
                      <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354"/>
                    </svg>
                  </button>
                </div>
              </>
            </div>
          ))}
        {Object.entries(chats)
          .filter(([_, chat]) => chat.userInfo && chat.userInfo.uid !== currentUser.uid && !chat.pinned)
          .map(([chatId, chat]) => (
            <div
              className={`userChat ${chat.pinned ? 'pin' : ''}`}
              key={chatId}
              onClick={() => handleSelect(chat.userInfo)}
            >
              <>
                <img
                  src={chat.userInfo.photoURL}
                  alt=""
                  className="icon"
                />
                <div className="name-message">
                  <span className="no-marb">{chat.userInfo.displayName}</span>
                  <p className="messages-ch">{truncateMessage(lastMessageTexts[chatId] || 'No messages', 8)}</p>
                </div>
                <div className="userChatInfo">
                  <button className="btn delete" onClick={() => handleDeleteChat(chatId)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" className="bi bi-trash3" viewBox="0 0 16 16">
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                  </button>
                  <br />
                  <button className="btn pin" onClick={() => handlePinChat(chatId)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" className="bi bi-pin-angle" viewBox="0 0 16 16">
                      <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146m.122 2.112v-.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a5 5 0 0 0-.288-.076 5 5 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a5 5 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034q.172.002.343-.04L9.927 2.028q-.042.172-.04.343a1.8 1.8 0 0 0 .062.46z"/>
                    </svg>
                  </button>
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
            {server.icon && <img src={server.icon} alt="Server Icon" className="icon" />}
            <div className="name-message">
             <span>{server.name}</span>
             <p className="messages-ch">{server.lastMessage ? server.lastMessage.text || 'No messages' : 'No messages'}</p>
            </div>
            
            {server.creatorId === currentUser.uid && (
              <button className="btn delete" onClick={() => handleDeleteServer(server.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" className="bi bi-trash3" viewBox="0 0 16 16">
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
