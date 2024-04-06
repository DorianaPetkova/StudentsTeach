import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from '../context/AuthC';
import { ChatContext } from '../context/ChatC';
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

    const fetchSenderInfo = async () => {
      try {
        // Fetch sender information based on the senderId
        const senderDocRef = doc(db, 'users', message.senderId);
        const senderDocSnap = await getDoc(senderDocRef);
        if (senderDocSnap.exists()) {
          setSenderInfo(senderDocSnap.data());
        } else {
          console.error("Sender document does not exist");
        }
      } catch (error) {
        console.error("Error fetching sender information:", error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        // Fetch current user's information based on their UID
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserInfo(userDocSnap.data());
        } else {
          console.error("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchSenderInfo();
    fetchUserInfo();
  }, [message.senderId, currentUser.uid]);

  return (
    <div 
      ref={ref} 
      className={`message ${message.senderId === currentUser.uid && "owner"}`} 
    >
      <div className="messageInfo">
        {senderInfo && (
          <img
            src={message.senderId === currentUser.uid ? userInfo?.photoURL : senderInfo.photoURL}
            alt=""
          />
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
