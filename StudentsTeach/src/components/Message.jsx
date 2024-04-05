import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from '../context/AuthC';
import { ChatContext } from '../context/ChatC';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [senderInfo, setSenderInfo] = useState(null);
  const [liked, setLiked] = useState(false); // State to track whether the message is liked
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });

    const fetchSenderInfo = async () => {
      try {
        if (data.server.id) {
          const senderDocRef = doc(db, 'users', message.senderId);
          const senderDocSnap = await getDoc(senderDocRef);
          if (senderDocSnap.exists()) {
            setSenderInfo(senderDocSnap.data());
          } else {
            console.error("Sender document does not exist");
          }
        } else {
          setSenderInfo(data.user);
        }
      } catch (error) {
        console.error("Error fetching sender information:", error);
      }
    };

    fetchSenderInfo();
  }, [data.server.id, data.user, message.senderId]);

  const handleDoubleClick = async (e) => {
    e.preventDefault(); // Prevent text selection
    const combinedId =
      currentUser.uid > message.senderId ? currentUser.uid + message.senderId : message.senderId + currentUser.uid;
    console.log("Combined ID:", combinedId); // Log combinedId to check its value
    const messageRef = doc(db, `chats/${combinedId}/messages`, message.id);
    console.log("Message Ref:", messageRef); // Log messageRef to check its value
    try {
      const messageDocSnap = await getDoc(messageRef);
      console.log("Message Doc Snap:", messageDocSnap); // Log messageDocSnap to check its value
      if (messageDocSnap.exists()) {
        console.log("Message Document Exists:", messageDocSnap.exists()); // Log the existence of the message document
        const messageData = messageDocSnap.data();
        const updatedLikes = liked ? messageData.likes - 1 : messageData.likes + 1;
        await updateDoc(messageRef, { likes: updatedLikes });
        setLiked(!liked);
      } else {
        console.error("Message document does not exist");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };
  return (
    <div 
      ref={ref} 
      className={`message ${message.senderId === currentUser.uid && "owner"}`} 
      onDoubleClick={handleDoubleClick}
    >
      <div className="messageInfo">
        {senderInfo && (
          <img
            src={message.senderId === currentUser.uid ? currentUser.photoURL : senderInfo.photoURL}
            alt=""
          />
        )}
      </div>
      <div className="messageContent">
        {message.text && <p onDoubleClick={handleDoubleClick}>{message.text}</p>}
        {message.img && <img src={message.img} alt="Sent Image" />}
        {message.likes && <span className="like-count">{message.likes} Likes</span>}
      </div>
    </div>
  );
}

export default Message;
