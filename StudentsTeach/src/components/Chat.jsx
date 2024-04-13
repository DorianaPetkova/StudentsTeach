import React, { useEffect, useContext, useState } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import whiteboard from "../img/whiteboard.png";
import Messages from "./Messages";
import Input from './Input';
import { ChatContext } from "../context/ChatC";
import Whiteboard from './Whiteboard';
import CalendarProp from './Calendar';
import { FaCalendarAlt } from "react-icons/fa";

const Chat = () => {
  const { data, dispatch } = useContext(ChatContext);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const [userDisplayName, setUserDisplayName] = useState(null); 

  useEffect(() => {
    let unsubscribeUser;
    let unsubscribeServer;
  
    // Listen for changes in the user document
    if (data.user && data.user.uid) {
      const userDocRef = doc(db, "users", data.user.uid);
      unsubscribeUser = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setUserDisplayName(userData.displayName);
        }
      });
    }
  
    // Listen for changes in the server document
    if (data.server && data.server.id) {
      const serverDocRef = doc(db, "servers", data.server.id);
      unsubscribeServer = onSnapshot(serverDocRef, (doc) => {
        if (doc.exists()) {
          const serverData = doc.data();
          setUserDisplayName(serverData.name);
        }
      });
    }
  
    return () => {
      // Unsubscribe from both listeners when the component unmounts
      if (unsubscribeUser) {
        unsubscribeUser();
      }
      if (unsubscribeServer) {
        unsubscribeServer();
      }
    };
  }, [data, userDisplayName]);
  
  
  
  
  const toggleWhiteboard = () => {
    setShowWhiteboard(!showWhiteboard);
    setShowCalendar(false);
    setShowInput(false);

  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    setShowWhiteboard(false);
    setShowInput(false);
  };

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span className='Logo'>{userDisplayName || data.server?.name}</span>
        <div className="chatIcons">
          <img src={whiteboard} alt='Whiteboard' onClick={toggleWhiteboard} />
          <FaCalendarAlt onClick={toggleCalendar} />
        </div>
      </div>
      {showWhiteboard && <Whiteboard chatId={data.chatId} />}
      {showCalendar && <CalendarProp groupId={data.groupId} />}
      {!showWhiteboard && !showCalendar && <Messages />}
      {!showWhiteboard && !showCalendar && <Input />}
    </div>
  );
};

export default Chat;
