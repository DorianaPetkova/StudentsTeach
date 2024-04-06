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
        const messagesData = doc.exists() ? doc.data().messages : [];
        setMessages(messagesData);
      });
    }

    return () => {
      unSub && unSub();
    };
  }, [data.chatId, data.server.id]);

  // Render nothing if no chat is selected
  if (!data.chatId) {
    return null;
  }

  return (
    <div className="messages">
      {messages.length > 0 ? (
        messages.map((m) => (
          <Message message={m} key={m.id} />
        ))
      ) : (
        <p>Nothing here but us chickens</p>
      )}
    </div>
  );
};

export default Messages;
