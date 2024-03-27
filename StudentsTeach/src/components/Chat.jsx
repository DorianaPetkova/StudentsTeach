import React, { useContext, useState } from 'react';
import whiteboard from "../img/whiteboard.png";
import Messages from "./Messages";
import Input from './Input';
import { ChatContext } from "../context/ChatC";
import Whiteboard from './Whiteboard';
import CalendarProp from './Calendar';
import { FaCalendarAlt } from "react-icons/fa";

const Chat = () => 
{
  const { data } = useContext(ChatContext);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleWhiteboard = () => 
  {
    setShowWhiteboard(!showWhiteboard);
    setShowCalendar(false); // Close the calendar when opening the whiteboard
  };

  const toggleCalendar = () => 
  {
    setShowCalendar(!showCalendar);
    setShowWhiteboard(false); // Close the whiteboard when opening the calendar
  };

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={whiteboard} alt='Whiteboard' onClick={toggleWhiteboard} />
          <FaCalendarAlt onClick={toggleCalendar} /> {/* Use the calendar icon component */}
        </div>
      </div>
      {showWhiteboard ? <Whiteboard chatId={data.chatId} /> : null} {/* Render whiteboard if showWhiteboard is true */}
      {showCalendar ? <CalendarProp groupId={data.groupId} /> : null} {/* Render calendar if showCalendar is true */}
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
