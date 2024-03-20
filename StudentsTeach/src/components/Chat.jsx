import React, { useContext, useState } from 'react';
import whiteboard from "../img/whiteboard.png";
import Messages from "./Messages";
import Input from './Input';
import { ChatContext } from "../context/ChatC";
import Whiteboard from './Whiteboard';

const Chat = () => 
{
  const { data } = useContext(ChatContext);
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  const toggleWhiteboard = () => 
  {
    setShowWhiteboard(!showWhiteboard);
  };

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={whiteboard} alt='Whiteboard' onClick={toggleWhiteboard} />
        </div>
      </div>
      {showWhiteboard ? <Whiteboard chatId={data.chatId} /> : <Messages />}
      <Input />
    </div>
  );
};

export default Chat;
