// Home.jsx
import React, { useState, useContext } from 'react';
import SideBar from '../components/sidebar';
import Chat from '../components/Chat';
import { IoIosPersonAdd } from 'react-icons/io';
import { FaBookBookmark, FaHandshakeAngle } from 'react-icons/fa6';
import { FaPaintBrush } from "react-icons/fa";
import { Link } from 'react-router-dom';


import ServerPopup from '../components/ServerPopup';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className='home'>
      <div className="buttons">
          <p><button className="button btn-primary homep-btn"> <Link to="/findbuddy"><IoIosPersonAdd/></Link></button></p>
          <p><button className="button btn-primary homep-btn"> <Link to="/becomebuddy"><FaBookBookmark/></Link></button></p>
          <p><button className="button btn-primary homep-btn"> <Link to="/profile"><FaPaintBrush/></Link></button></p>
          <button onClick={togglePopup}><FaHandshakeAngle/>Create Server</button>
      {showPopup && <ServerPopup onClose={togglePopup} />}
        </div>
      <div className="container">
        <SideBar />
        <Chat />
      </div>
      <div className="buttons">
          
          <button onClick={togglePopup}><FaHandshakeAngle/>Create Server</button>
      {showPopup && <ServerPopup onClose={togglePopup} />}
        </div>
    </div>
  );
};

export default Home;
