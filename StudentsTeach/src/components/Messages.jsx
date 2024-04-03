import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatC";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    let unSub;

    if (data.chatId) {
      // Check if the current chat is a server chat or a user chat
      const collectionRef = data.server.id
        ? doc(db, "serverChats", data.server.id)
        : doc(db, "chats", data.chatId);

      unSub = onSnapshot(collectionRef, (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });
    }

    return () => {
      unSub && unSub();
    };
  }, [data.chatId, data.server.id]);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
