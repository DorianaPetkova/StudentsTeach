import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatC";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let unSub;
//we check if its a server or a dm, then we render the messages
    if (data.chatId) {
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

  if (!data.chatId) {
    return null;
  }

  return (
    <div className="messages">
      {(messages || []).length > 0 ? ( 
        messages.map((m) => (
          <Message message={m} key={m.id} />
        ))
      ) : (
        <p className="message-empty">Nothing here but us chickens</p>
      )}
    </div>
  );
};

export default Messages;
