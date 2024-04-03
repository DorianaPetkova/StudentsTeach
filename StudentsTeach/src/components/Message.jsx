import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from '../context/AuthC';
import { ChatContext } from '../context/ChatC';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [senderInfo, setSenderInfo] = useState(null);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });

    // Fetch sender information from Firestore
    const fetchSenderInfo = async () => {
      try {
        // Check if the chat is a server chat or a DM
        if (data.server.id) {
          // Fetch sender's information from Firestore using senderId
          const senderDocRef = doc(db, 'users', message.senderId);
          const senderDocSnap = await getDoc(senderDocRef);
          if (senderDocSnap.exists()) {
            setSenderInfo(senderDocSnap.data());
          } else {
            console.error("Sender document does not exist");
          }
        } else {
          // For DMs, use the sender information stored in the data context
          setSenderInfo(data.user);
        }
      } catch (error) {
        console.error("Error fetching sender information:", error);
      }
    };

    fetchSenderInfo();
  }, [data.server.id, data.user, message.senderId]);

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        {senderInfo && (
          <img
            src={message.senderId === currentUser.uid ? currentUser.photoURL : senderInfo.photoURL}
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
