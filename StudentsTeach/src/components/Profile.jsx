import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthC';
import { db, storage } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';

const Profile = ({ onClose }) => {
    const { currentUser } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!currentUser || !currentUser.uid) {
                    console.log('User is not signed in or user ID is missing.');
                    return;
                }
        
                const userRef = doc(db, 'users', currentUser.uid);
                const docSnapshot = await getDoc(userRef);
        
                if (!docSnapshot.exists()) {
                    console.log('User data not found');
                    return;
                }
        
                setUserData(docSnapshot.data());
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        
        fetchUserData();
    }, [currentUser]); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData({ ...editedData, [name]: value });
    };

    const handleAvatarChange = (e) => {
        if (e.target.files[0]) {
            setAvatar(e.target.files[0]);
        }
    };

    const saveChanges = async () => {
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            const updatedData = { ...userData, ...editedData };
            await updateDoc(userRef, updatedData);
            updatedData.bio = editedData.bio || userData.bio;
    
            if (avatar) {
                const storageRef = ref(storage, `avatars/${currentUser.uid}`);
                await uploadBytes(storageRef, avatar);
                const downloadURL = await getDownloadURL(storageRef);
                await updateDoc(userRef, { photoURL: downloadURL });
                setAvatarUrl(downloadURL);
            }
            setEditMode(false);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };
    

    const renderEditMode = () => (
        <div className="edit-mode">
            <h1 className='heading-ch-pr'>Edit Profile</h1>
            {
                <div className='row'>
                    <div className="col-lg-6 col-md-6 col-sm-6">
                    <label htmlFor="displayName" className='change-prfile-items'>Username:</label>
                        
                            <input 
                                type="text"
                                className='form-control'
                                id="displayName"
                                name="displayName"
                                value={editedData.displayName || userData.displayName}
                                onChange={handleInputChange}
                            />
                       
                            <div>
    <label htmlFor="country" className='change-prfile-items'>Country:</label>
   
        <select
            id="country"
            className='form-control'
            name="country"
            value={editedData.country || userData.country}
            onChange={handleInputChange}
        >
            <option value="Any">Any</option>
            <option value="Afghanistan">Afghanistan</option>
  <option value="Albania">Albania</option>
  <option value="Algeria">Algeria</option>
  <option value="Andorra">Andorra</option>
  <option value="Angola">Angola</option>
  <option value="Antigua and Barbuda">Antigua and Barbuda</option>
  <option value="Argentina">Argentina</option>
  <option value="Armenia">Armenia</option>
  <option value="Australia">Australia</option>
  <option value="Austria">Austria</option>
  <option value="Azerbaijan">Azerbaijan</option>
  <option value="Bahamas">Bahamas</option>
  <option value="Bahrain">Bahrain</option>
  <option value="Bangladesh">Bangladesh</option>
  <option value="Barbados">Barbados</option>
  <option value="Belarus">Belarus</option>
  <option value="Belgium">Belgium</option>
  <option value="Belize">Belize</option>
  <option value="Benin">Benin</option>
  <option value="Bhutan">Bhutan</option>
  <option value="Bolivia">Bolivia</option>
  <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
  <option value="Botswana">Botswana</option>
  <option value="Brazil">Brazil</option>
  <option value="Brunei">Brunei</option>
  <option value="Bulgaria">Bulgaria</option>
  <option value="Burkina Faso">Burkina Faso</option>
  <option value="Burundi">Burundi</option>
  <option value="Cabo Verde">Cabo Verde</option>
  <option value="Cambodia">Cambodia</option>
  <option value="Cameroon">Cameroon</option>
  <option value="Canada">Canada</option>
  <option value="Central African Republic">Central African Republic</option>
  <option value="Chad">Chad</option>
  <option value="Chile">Chile</option>
  <option value="China">China</option>
  <option value="Colombia">Colombia</option>
  <option value="Comoros">Comoros</option>
  <option value="Congo (Congo-Brazzaville)">Congo (Congo-Brazzaville)</option>
  <option value="Costa Rica">Costa Rica</option>
  <option value="Croatia">Croatia</option>
  <option value="Cuba">Cuba</option>
  <option value="Cyprus">Cyprus</option>
  <option value="Czechia (Czech Republic)">Czechia (Czech Republic)</option>
  <option value="Denmark">Denmark</option>
  <option value="Djibouti">Djibouti</option>
  <option value="Dominica">Dominica</option>
  <option value="Dominican Republic">Dominican Republic</option>
  <option value="Ecuador">Ecuador</option>
  <option value="Egypt">Egypt</option>
  <option value="El Salvador">El Salvador</option>
  <option value="Equatorial Guinea">Equatorial Guinea</option>
  <option value="Eritrea">Eritrea</option>
  <option value="Estonia">Estonia</option>
  <option value="Eswatini (fmr. 'Swaziland')">Eswatini (fmr. 'Swaziland')</option>
  <option value="Ethiopia">Ethiopia</option>
  <option value="Fiji">Fiji</option>
  <option value="Finland">Finland</option>
  <option value="France">France</option>
  <option value="Gabon">Gabon</option>
  <option value="Gambia">Gambia</option>
  <option value="Georgia">Georgia</option>
  <option value="Germany">Germany</option>
  <option value="Ghana">Ghana</option>
  <option value="Greece">Greece</option>
  <option value="Grenada">Grenada</option>
  <option value="Guatemala">Guatemala</option>
  <option value="Guinea">Guinea</option>
  <option value="Guinea-Bissau">Guinea-Bissau</option>
  <option value="Guyana">Guyana</option>
  <option value="Haiti">Haiti</option>
  <option value="Holy See">Holy See</option>
  <option value="Honduras">Honduras</option>
  <option value="Hungary">Hungary</option>
  <option value="Iceland">Iceland</option>
  <option value="India">India</option>
  <option value="Indonesia">Indonesia</option>
  <option value="Iran">Iran</option>
  <option value="Iraq">Iraq</option>
  <option value="Ireland">Ireland</option>
  <option value="Israel">Israel</option>
  <option value="Italy">Italy</option>
  <option value="Jamaica">Jamaica</option>
  <option value="Japan">Japan</option>
  <option value="Jordan">Jordan</option>
  <option value="Kazakhstan">Kazakhstan</option>
  <option value="Kenya">Kenya</option>
  <option value="Kiribati">Kiribati</option>
  <option value="Kuwait">Kuwait</option>
  <option value="Kyrgyzstan">Kyrgyzstan</option>
  <option value="Laos">Laos</option>
  <option value="Latvia">Latvia</option>
  <option value="Lebanon">Lebanon</option>
  <option value="Lesotho">Lesotho</option>
  <option value="Liberia">Liberia</option>
  <option value="Libya">Libya</option>
  <option value="Liechtenstein">Liechtenstein</option>
  <option value="Lithuania">Lithuania</option>
  <option value="Luxembourg">Luxembourg</option>
  <option value="Madagascar">Madagascar</option>
  <option value="Malawi">Malawi</option>
  <option value="Malaysia">Malaysia</option>
  <option value="Maldives">Maldives</option>
  <option value="Mali">Mali</option>
  <option value="Malta">Malta</option>
  <option value="Marshall Islands">Marshall Islands</option>
        </select>
   
    </div>
    <div>
    <label htmlFor="subject" className='change-prfile-items'>Subject:</label>
    
        <select
            id="subject"
            name="subject"
            className='form-control'
            value={editedData.subject || userData.subject}
            onChange={handleInputChange}
        >
            <option value="Any">Any</option>
            <option value="Arts&Culture">Arts&Culture</option>
            <option value="Biology">Biology</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Engineering">Engineering</option>
            <option value="Food&nutrition">Food&nutrition</option>
            <option value="History">History</option>
            <option value="Language">Language</option>
            <option value="Law">Law</option>
            <option value="Literature">Literature</option>
            <option value="Math">Math</option>
            <option value="Medicine">Medicine</option>
            <option value="Music">Music</option>
            <option value="Philosophy">Philosophy</option>
            <option value="Physics">Physics</option>
            <option value="Social Science">Social Science</option>
        </select>
            
        </div>



                    </div>
        <div className="col-lg-6 col-md-6 col-sm-6">
                    <label htmlFor="photoURL" className='change-prfile-items'>Avatar:</label>
                        
                            <>
                                <input type="file" id="avatar" name="avatar" className='ava-rec' onChange={handleAvatarChange} />
                                {avatarUrl && <img src={avatarUrl} alt="Avatar" />}
                            </>
                        
                         <div className='mar-top'>
                            <label htmlFor="email" className='change-prfile-items'>Email:</label>
                            <span className='examplee'>{userData.email}</span>
                        </div>
                        <label htmlFor="bio" className='change-prfile-items'>Bio:</label>
                        
        <input 
            type="text"
            className='input-bio' 
            id="bio"
            name="bio"
            value={editedData.bio || ''}
            onChange={handleInputChange}
            maxLength={200}
        />
       
        </div>
    </div>}
            <button className='btnSaveProfile' onClick={saveChanges}>Save</button>
        </div>
    );

    // return when not in edit mode
    const renderDisplayMode = () => (
        
        <div className="display-mode">
             <div className="close" onClick={onClose}>&times;</div>
            <h1 className='heading-ch-pr'>View Profile</h1>
            {userData && (
             <div className='row view'>
             <div className="col-lg-6 col-md-6 col-sm-6 view">
            
            <div>
                    <label className='change-prfile-items'>Username:</label>

                    <span className='examplee'>{userData.displayName}</span>
            </div>
             
             <div>
             <label htmlFor="country" className='change-prfile-items'>Country:</label>

             <span className='examplee'>{userData.country}</span>
             </div>          

            <div>
                        <label htmlFor="subject" className='change-prfile-items'>Subject:</label>
                        <span className='examplee'>{userData.subject}</span>
            </div>
             </div>


             <div className="col-lg-6 col-md-6 col-sm-6">
                <div> 
                    <label htmlFor="photoURL" className='change-prfile-items'>Avatar:</label>
                    <img src={userData.photoURL} alt="Avatar" className='ava' />
                </div>
            
                <div>
                    <label htmlFor="email" className='change-prfile-items'>Email:</label>
                    <span className='examplee'>{userData.email}</span>
                </div>  
             </div>    
            </div>   
        )}
 {userData && (
                    <div className='center-bio'>
                          <label htmlFor="bio" className='change-prfile-items'>Bio:</label>
                          <span className='examplee'>{userData.bio}</span>
                    </div> 
 )}
            <button className='btnEditProfile' onClick={() => setEditMode(true)}>Edit</button>
           
        </div>
    );

    return (
        <div className="server-popup">
            {editMode ? renderEditMode() : renderDisplayMode()}
        </div>
    );
};

export default Profile;

