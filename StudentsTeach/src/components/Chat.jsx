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

  useEffect(() => {
    let unsubscribe;
    if (data.user && data.user.uid) {
      // Subscribe to real-time updates on the user document
      unsubscribe = onSnapshot(doc(db, "users", data.user.uid), (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          // Dispatch an action to update the user's displayName in the context
          dispatch({
            type: "UPDATE_USER_DISPLAY_NAME",
            payload: userData.displayName || data.server?.name
          });
        }
      });
    }
  
    return () => {
      // Unsubscribe from real-time updates when the component unmounts
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [data.user, data.server?.name, dispatch]);
  
  const toggleWhiteboard = () => {
    setShowWhiteboard(!showWhiteboard);
    setShowCalendar(false); // Close the calendar when opening the whiteboard
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    setShowWhiteboard(false); // Close the whiteboard when opening the calendar
  };

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span className='Logo'>{data.user?.displayName || data.server?.name}</span> {/* Render either user or server name */}
        <div className="chatIcons">
          <img src={whiteboard} alt='Whiteboard' onClick={toggleWhiteboard} />
          <FaCalendarAlt onClick={toggleCalendar} /> {/* Use the calendar icon component */}
        </div>
      </div>
      {showWhiteboard ? <Whiteboard chatId={data.chatId} /> : null} {/* Render whiteboard if showWhiteboard is true */}
      {showCalendar ? <CalendarProp groupId={data.groupId} /> : null} {/* Render calendar if showCalendar is true */}
      {!showWhiteboard && !showCalendar && <Messages />} {/* Render messages if neither whiteboard nor calendar is open */}
      <Input />
    </div>
  );
};

export default Chat;
