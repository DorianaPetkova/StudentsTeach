// Home.jsx
import React, { useState, useContext } from 'react';
import SideBar from '../components/sidebar';
import Chat from '../components/Chat';
import { IoIosPersonAdd } from 'react-icons/io';
import { FaBookBookmark, FaHandshakeAngle } from 'react-icons/fa6';
import { Link } from 'react-router-dom';


import ServerPopup from '../components/ServerPopup';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className='home'>
      <div className="container">
        <SideBar />
        <Chat />
        <div className="buttons">
          <button><IoIosPersonAdd /> <Link to="/findbuddy">Findbuddy</Link></button>
          <button><FaBookBookmark /> <Link to="/becomebuddy">Becomebuddy</Link></button>
         <button onClick={togglePopup}><FaHandshakeAngle/>Create Server</button>
      {showPopup && <ServerPopup onClose={togglePopup} />}
        </div>
        
      </div>
    </div>
  );
};

export default Home;
