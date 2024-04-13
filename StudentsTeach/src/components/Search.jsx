import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthC";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map((doc) => doc.data());
      setUser(userData.length ? userData[0] : null);
    } catch (error) {
      console.error("Error searching for user:", error);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    if (!user) return;
//we prevent chatting with yourself and adding a user twice because it will create an error in firestore with the ids
    if (user.uid === currentUser.uid) {
      alert("You cannot chat with yourself.");
      return;
    }

    const combinedId =
      currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

    try {
      const chatDocRef = doc(db, "chats", combinedId);
      const chatDocSnap = await getDoc(chatDocRef);

      if (!chatDocSnap.exists()) {
        await setDoc(chatDocRef, { messages: [] });

        const userInfo = {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        const currentUserChatData = {
          [combinedId + ".userInfo"]: userInfo,
          [combinedId + ".date"]: serverTimestamp(),
        };

        const otherUserChatData = {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        };

        await Promise.all([
          updateDoc(doc(db, "userChats", currentUser.uid), currentUserChatData),
          updateDoc(doc(db, "userChats", user.uid), otherUserChatData),
        ]);

        setUser(null);
        setUsername("");
      } else {
        console.log("Chat already exists");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
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
