import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthC';
import { db, storage } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ServerPopup = ({ onClose }) => {
  const { currentUser } = useContext(AuthContext);
  const [serverName, setServerName] = useState('');
  const [icon, setIcon] = useState(null);
  const [iconName, setIconName] = useState('No file chosen');
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [enterPressed, setEnterPressed] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), where('displayName', '==', searchInput));
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSearchResults(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setEnterPressed(false); // Ensure enterPressed is set to false after fetching users
      }
    };

    if (enterPressed) {
      fetchUsers(); 
    }

    return () => {
      setEnterPressed(false); // Cleanup function to reset enterPressed on unmount or re-render
    };
  }, [searchInput, enterPressed]);

  const handleServerNameChange = (e) => {
    setServerName(e.target.value);
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    setIcon(file);
    setIconName(file ? file.name : 'No file chosen');
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
      alert("User is already selected.");
      return;
    }

    setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
    setSearchResults((prevSearchResults) =>
      prevSearchResults.filter((resultUser) => resultUser.id !== user.id)
    );
    setSearchInput('');
  };

  const handleCreateServer = async () => {
    try {
      if (selectedUsers.find(user => user.id === currentUser.uid)) {
        alert("You cannot add yourself to the server.");
        return;
      }

      const userIds = new Set(selectedUsers.map(user => user.id));
      if (userIds.size !== selectedUsers.length) {
        alert("Please select each user only once.");
        return;
      }

      const timestamp = new Date().getTime();
      const serverId = `${currentUser.uid}_${timestamp}`;

      const iconRef = ref(storage, `server_icons/${serverId}_${icon.name}`);
      await uploadBytesResumable(iconRef, icon);

      const iconURL = await getDownloadURL(iconRef);

      const serverRef = doc(db, 'servers', serverId);
      await setDoc(serverRef, {
        id: serverId,
        name: serverName,
        icon: iconURL,
        members: [currentUser.uid, ...selectedUsers.map((user) => user.id)],
        lastMessage: null,
        creatorId: currentUser.uid,
      });

      const serverDoc = await getDoc(serverRef);
      const serverData = serverDoc.data();
      const serverChatsRef = doc(db, 'serverChats', serverId);
      await setDoc(serverChatsRef, serverData);

      for (const user of selectedUsers) {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          servers: {
            [serverRef.id]: true,
          },
        });
      }

      onClose();

      setServerName('');
      setIcon(null);
      setIconName('No file chosen');
      setSelectedUsers([]);
      setSearchInput('');
    } catch (error) {
      console.error('Error creating server:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setEnterPressed(true);
    }
  };

  return (
    <div className="server-popup">
      <div className="close" onClick={onClose}>&times;</div>
      <h2>Create Server</h2>
      <input type="text" placeholder="Server Name" value={serverName} onChange={handleServerNameChange} />
      <div className="file-input-1">
        <input type="file" accept="image/*" id="file" onChange={handleIconChange} />
      </div>
      <input
        type="text"
        placeholder="Search Users"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <div className="search-results">
        {searchResults
          .filter(user => user.id !== currentUser.uid) // Exclude current user from search results
          .map(user => (
            <div key={user.id} onClick={() => handleUserSelect(user)}>
              <img src={user.photoURL} alt="" />
              {user.displayName}
            </div>
          ))}
      </div>
      {selectedUsers.length > 0 && (
        <div className="selected-users">
          <div className="selected-line"></div>
          <p className='create-serv'>Selected users:</p>
          <ul>
            {selectedUsers.map(user => (
              <li className='create-serv' key={user.id}>
                <img src={user.photoURL} alt="" />
                {user.displayName}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button className='createServ' onClick={handleCreateServer}>Create Server</button>
    </div>
  );
};

export default ServerPopup;
