import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import {auth} from "../firebase"

import { AuthContext } from '../context/AuthC'

const NavBar = () => {
  const {currentUser} = useContext(AuthContext)

  return (
    <div className='navbar1'>
     
      <div className='user'>
      <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button className='btn logout' onClick={()=>signOut(auth)}>Log out</button>
      </div>
      
    </div>
  )
}

export default NavBar