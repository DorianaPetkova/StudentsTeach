import React from "react";
import NavBar from "./NavBar"
import Search from "./Search"
import Chats from "./Chats"

const SideBar = () => {
  return (
    <div className="sidebar">
       <div className='navbar'>
      <span className='Logo'>
        StudentsTEACH
      </span>
      </div>
    
      <Search/>
      <Chats/>
      <NavBar />
    </div>
  );
};

export default SideBar;