import React, { useContext, useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { AuthContext } from '../context/AuthC';
import { doc, getDoc } from "firebase/firestore";

const NavBar = () => {
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (currentUser) {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserInfo(userDocSnap.data());
          } else {
            console.error("User document does not exist");
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInfo();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    // Save the last opened chat ID in local storage
    localStorage.setItem('lastOpenedChatId', lastOpenedChatId);
    // Perform logout

    signOut(auth);
  };

  return (
    <div className='navbar1'>
      <div className='user'>
      {userInfo && userInfo.photoURL && (
          <>
          <img src={userInfo.photoURL} alt="" />
          <span>{userInfo.displayName}</span>
          </>
        )}
        <button className='btn logout'  onClick={() => { signOut(auth); handleLogout(); }}>Log out</button>
        </div>
    </div>
  );
};
export default NavBar;