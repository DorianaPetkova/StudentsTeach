import React, { useContext, useState } from 'react';
import whiteboard from "../img/whiteboard.png";
import Messages from "./Messages";
import Input from './Input';
import { ChatContext } from "../context/ChatC";
import Whiteboard from './Whiteboard';
import CalendarProp from './Calendar';
import { FaCalendarAlt } from "react-icons/fa";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleWhiteboard = () => {
    setShowWhiteboard(!showWhiteboard);
    setShowCalendar(false); // Close the calendar when opening the whiteboard
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    setShowWhiteboard(false); // Close the whiteboard when opening the calendar
  };

  const toggleMessages = () => {
    // Check if the current chat is a server chat
    if (data.server) {
      // If it's a server chat, dispatch an action to change the server
      dispatch({ type: "CHANGE_SERVER", payload: data.chatInfo });
    } else {
      // If it's a user chat, dispatch an action to change the user
      dispatch({ type: "CHANGE_USER", payload: data.chatInfo });
    }
    setShowWhiteboard(false);
    setShowCalendar(false);
  };

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user?.displayName || data.server?.name}</span> {/* Render either user or server name */}
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
