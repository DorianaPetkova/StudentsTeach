import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from '../context/AuthC'
import { ChatContext } from '../context/ChatC'


const Message = ({message}) => {
  const{currentUser} = useContext(AuthContext)
  const{data} = useContext(ChatContext)
  const ref=useRef();
  
  useEffect(() => 
  {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div ref={ref}
    className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL}
               />
      </div>
      <div className="messageContent">
          {/* Conditionally render the paragraph based on the presence of text */}
          {message.text && <p>{message.text}</p>}
          {message.img && <img src={message.img} alt="Sent Image" />}
        </div>
      
    </div>
  )
}

export default Message