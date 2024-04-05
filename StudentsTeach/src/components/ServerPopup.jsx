import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthC';
import { db, storage } from '../firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ServerPopup = ({ onClose }) => {
  const { currentUser } = useContext(AuthContext);
  const [serverName, setServerName] = useState('');
  const [icon, setIcon] = useState(null);
  const [iconName, setIconName] = useState('No file chosen');
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('displayName', '==', searchInput)
        );
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSearchResults(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (searchInput.trim() !== '') {
      fetchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchInput]);

  const handleServerNameChange = (e) => {
    setServerName(e.target.value);
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    setIcon(file);
    setIconName(file ? file.name : 'No file chosen');
  };

  const handleUserSelect = (user) => {
    setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
    setSearchInput('');
  };

  const handleCreateServer = async () => {
    try {
      // Generate a unique server ID using a combination of user IDs and a timestamp
      const timestamp = new Date().getTime();
      const serverId = `${currentUser.uid}_${timestamp}`;
  
      // Upload icon to Firebase Storage
      const iconRef = ref(storage, `server_icons/${serverId}_${icon.name}`);
      await uploadBytesResumable(iconRef, icon);
  
      // Get the download URL of the uploaded icon
      const iconURL = await getDownloadURL(iconRef);
  
      // Create the server document
      const serverRef = await addDoc(collection(db, 'servers'), {
        id: serverId,
        name: serverName,
        icon: iconURL, // Store the download URL of the icon in the Firestore document
        members: [currentUser.uid, ...selectedUsers.map((user) => user.id)],
      });
  
      // Update user documents to include reference to the server
      for (const user of selectedUsers) {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          servers: {
            [serverRef.id]: true,
          },
        });
      }
  
      // Close the popup when server is created successfully
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
      />
      <div className="search-results">
        {searchResults.map(user => (
          <div key={user.id} onClick={() => handleUserSelect(user)}>
            <img src={user.photoURL} alt="" />
            {user.displayName}
          </div>
        ))}
      </div>
      {selectedUsers.length > 0 && (
        <div className="selected-users">
          <div className="selected-line"></div>
          <p>Selected users:</p>
          <ul>
            {selectedUsers.map(user => (
              <li key={user.id}>
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
