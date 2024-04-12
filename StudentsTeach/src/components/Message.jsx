import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from '../context/AuthC';
import { ChatContext } from '../context/ChatC';
import { useQuery } from 'react-query'; 
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [senderInfo, setSenderInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  
  const { data: senderData, isLoading: senderLoading, error: senderError } = useQuery(['user', message.senderId], async () => {
    const senderDocRef = doc(db, 'users', message.senderId);
    const senderDocSnap = await getDoc(senderDocRef);
    return senderDocSnap.exists() ? senderDocSnap.data() : null;
  });

  const { data: currentUserData, isLoading: currentUserLoading, error: currentUserError } = useQuery(['user', currentUser.uid], async () => {
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.exists() ? userDocSnap.data() : null;
  });

  
  useEffect(() => {
    if (senderData) {
      setSenderInfo(senderData);
    }
  }, [senderData]);

  useEffect(() => {
    if (currentUserData) {
      setUserInfo(currentUserData);
    }
  }, [currentUserData]);

  const isOwner = message.senderId === currentUser.uid;

  // Save message to local storage
  useEffect(() => {
    const saveMessageToLocalstorage = () => {
      const messages = JSON.parse(localStorage.getItem('messages')) || [];
      messages.push(message);
      localStorage.setItem('messages', JSON.stringify(messages));
    };

    saveMessageToLocalstorage();
  }, [message]);

  // Load messages from local storage
  const [messagesFromLocalStorage, setMessagesFromLocalStorage] = useState([]);
  useEffect(() => {
    const loadMessagesFromLocalStorage = () => {
      const messages = JSON.parse(localStorage.getItem('messages')) || [];
      setMessagesFromLocalStorage(messages);
    };

    loadMessagesFromLocalStorage();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`message ${isOwner ? "owner" : ""}`} 
    >
      <div className="messageInfo">
        {senderLoading || currentUserLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {senderInfo && (
              <img
                src={isOwner ? userInfo?.photoURL : senderInfo.photoURL}
                alt=""
              />
            )}
          </>
        )}
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="Sent Image" />}
      </div>
    </div>
  );
}

export default Message;
