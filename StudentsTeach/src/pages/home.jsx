import React from 'react'
import SideBar from '../components/sidebar'
import Chat from '../components/Chat'
import { IoIosPersonAdd } from "react-icons/io";
import { FaBookBookmark } from "react-icons/fa6";
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  return (
    
    <div className='home'>
    <div className="container">
      <SideBar />
      <Chat />
      {/* Adding buttons with react-icons */}
      <div className="buttons">
        <button><IoIosPersonAdd /> <Link to="/findbuddy">Findbuddy</Link></button>
        <button><FaBookBookmark /> <Link to="/becomebuddy">Becomebuddy</Link></button>
        
      </div>
    </div>
  </div>
  )
}

export default Home