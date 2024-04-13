// Home.jsx
import React, { useState } from 'react';
import SideBar from '../components/sidebar';
import Chat from '../components/Chat';
import { IoIosPersonAdd } from 'react-icons/io';
import { FaBookBookmark, FaHandshakeAngle } from 'react-icons/fa6';
import { FaPaintBrush } from "react-icons/fa";
import { Link } from 'react-router-dom';


import ServerPopup from '../components/ServerPopup';
import Profile from '../components/Profile'

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupCP, setShowPopupCP] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    
  };
  const togglePopupCP=()=>
  {
    setShowPopupCP(!showPopupCP);
  }

 
  return (
    <div className='home'>
    <div className="buttons">
      <p><Link to="/findbuddy"><button className="button btn-primary homep-btn"> <IoIosPersonAdd/></button></Link></p>
      <p><Link to="/becomebuddy"><button className="button btn-primary homep-btn"> <FaBookBookmark/></button></Link></p>
      <p><button className="button btn-primary homep-btn" onClick={togglePopupCP}><FaPaintBrush/></button></p>
        {showPopupCP && <Profile onClose={togglePopupCP} />}
      <p><button className="button btn-primary homep-btn" onClick={togglePopup}><FaHandshakeAngle/></button></p>
        {showPopup && <ServerPopup onClose={togglePopup} />}
    </div>
    <div className="container">
      <SideBar />
      <Chat />
    </div>
  </div>
  );
};

export default Home;
