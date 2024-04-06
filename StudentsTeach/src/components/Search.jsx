import React, { useContext, useState } from "react";
import {
  collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc, } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthC";

const Search = () => {
  
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => 
  {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
  
    try 
    {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => 
      {
        setUser(doc.data());
      });
    } catch (error) 
    {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error creating user:", errorCode, errorMessage);
    }
  };

  const handleKey = (e) => 
  {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    // Check if the selected user is the same as the current user
    if (user.uid === currentUser.uid) {
      // Display an error message or perform any desired action
      alert("You cannot chat with yourself.");
      return;
    }
  
    // Check whether the chat exists
    const combinedId =
      currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    
    try {
      const chatDocRef = doc(db, "chats", combinedId);
      const chatDocSnap = await getDoc(chatDocRef);
  
      // If the chat document does not exist, create it
      if (!chatDocSnap.exists()) {
        // Create a chat in chats collection
        await setDoc(chatDocRef, { messages: [] });
  
        // Create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
  
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      } else {
        console.log("Chat already exists");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  
    setUser(null);
    setUsername("");
  };
  



  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          
        />
      </div>
       {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Search;