import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthC";
import { ChatContext } from "../context/ChatC";
import attachFile from '../img/attachFile.jpg';
import attachImage from '../img/attachImage.png';
import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";



const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Start listening for new messages after sending a message
    if (isListening) {
      const chatId = data.server.id || data.chatId;
      const serverChatRef = doc(db, data.server.id ? "serverChats" : "chats", chatId);
      const unsubscribe = onSnapshot(serverChatRef, () => {
       
      });
      
      return () => unsubscribe();
    }
  }, [isListening, data.server, data.chatId]);

  const handleSend = async () => {
    const chatId = data.server.id || data.chatId;
    const serverChatRef = doc(db, data.server.id ? "serverChats" : "chats", chatId);
    const messageData = {
      id: uuid(),
      text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
      img: null,
    };

    try {
      const chatSnapshot = await getDoc(serverChatRef);
      if (chatSnapshot.exists()) {
        await updateDoc(serverChatRef, {
          messages: arrayUnion(messageData),
          lastMessage: messageData,
        });
      } else {
        await setDoc(serverChatRef, {
          id: chatId,
          name: data.server.name,
          messages: [messageData],
          lastMessage: messageData,
        });
      }

      if (img) {
        const storageRef = ref(storage, `${data.server.id || "chats"}/${chatId}/${uuid()}`);
        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on("state_changed", null, (error) => {
          console.error("Error uploading image:", error);
        }, async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          messageData.img = downloadURL;
          await updateDoc(serverChatRef, {
            messages: arrayUnion(messageData),
            lastMessage: messageData,
          });
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setText("");
    setImg(null);

   
    setIsListening(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='input'>
      <input
        type="text"
        placeholder='Message user'
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleKeyDown}
      />
      <div className="send">
        <img src={attachFile} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={attachImage} alt="" />
        </label>
        <button className="btnSend" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
