import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthC";
import { ChatContext } from "../context/ChatC";

import attachFile from '../img/attachFile.jpg';
import attachImage from '../img/attachImage.png';

import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  getDoc, 
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


const Input = () => {

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);


  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (data.server.id) {
      const serverChatRef = doc(db, "serverChats", data.server.id);
      const messageData = {
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
        img: null, // Placeholder for image URL
      };
  
      try {
        const serverChatSnapshot = await getDoc(serverChatRef);
        if (serverChatSnapshot.exists()) {
          await updateDoc(serverChatRef, {
            messages: arrayUnion(messageData),
            lastMessage: messageData, // Update the lastMessage field with the latest message
            
          });
          
        } else {
          await setDoc(serverChatRef, {
            id: data.server.id,
            name: data.server.name,
            messages: [messageData],
            lastMessage: messageData, // Initialize the lastMessage field if it doesn't exist
          });
        }
  
        if (data.server.id && data.server.members && Array.isArray(data.server.members)) {
          data.server.members.forEach(async (memberId) => {
            await updateDoc(doc(db, "userChats", memberId), {
              [data.server.id + ".lastMessage"]: messageData,
              [data.server.id + ".date"]: serverTimestamp(),
            });
          });
        }
  
        if (img) {
          const storageRef = ref(storage, `serverChats/${data.server.id}/${uuid()}`);
          const uploadTask = uploadBytesResumable(storageRef, img);
  
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Error uploading image:", error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                messageData.img = downloadURL;
                await updateDoc(serverChatRef, {
                  messages: arrayUnion(messageData),
                  lastMessage: messageData, // Update the lastMessage field with the latest message
                });
              });
            }
          );
        }
      } catch (error) {
        console.error("Error sending message to server chat:", error);
      }
    } else {
      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);
  
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Error uploading image:", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
            });
          }
        );
      } else {
        await updateDoc(doc(db, "chats", data.chatId), 
          {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
            }),
          });
      }
  
      await updateDoc(doc(db, "userChats", currentUser.uid), 
        {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
  
      await updateDoc(doc(db, "userChats", data.user.uid), 
        {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
    }
  
    setText("");
  };
  
  
    
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents adding new line
      handleSend(); // Call handleSend function when Enter key is pressed
    }
  };


  return (
    <div className='input'>
      <input type="text"
       placeholder='Message user' 
       onChange={(e) => setText(e.target.value)}
       value={text}
       onKeyDown={handleKeyDown} // Add the onKeyDown event handler here
       />
      <div className="send">
      <img src={attachFile} alt="" />
        <input
          type="file"
          style={{ display: "none" 
        }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
        <img src={attachImage} alt="" />
        </label >
        <button className="btnSend" onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input;
