import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, storage } from "../firebase";
import becomebuddyimg from '../img/become-buddy-img.png';

const BecomeBuddy = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState(''); 
  const [displayName, setDisplayName] = useState('');
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    subjectToTeach: '',
    preferredLanguage: ''
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((userAuth) => {
      setUser(userAuth);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      return; // leave if user is null to save time
    }
  
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDisplayName(userData.displayName);
          setAvatar(userData.photoURL);
          setBio(userData.bio);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  
    //we update the buddies collection when user data changes for accuracy
    const unsubscribeUser = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.data();
        setDisplayName(userData.displayName);
        setAvatar(userData.photoURL);
        setBio(userData.bio); 
  
        
        const buddyDocRef = doc(db, 'buddies', user.uid);
        setDoc(buddyDocRef, {
          ...userData,
          photoURL: userData.photoURL,
          bio: userData.bio 
        }, { merge: true });
      }
    });
  
    return () => unsubscribeUser();
  }, [user]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
  
      const { subjectToTeach, gender, age, preferredLanguage } = formData;
  
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }
  
      const userData = userDoc.data();
  
      
      const { education } = userData;
  
      // save the fetched data from users and the new one to firestore
      await setDoc(doc(db, "buddies", user.uid), {
        uid: user.uid,
        displayName,
        email: user.email,
        photoURL: avatar, 
        subject: subjectToTeach,
        education: education, 
        gender,
        age,
        preferredLanguage,
        bio
      });
  
      setLoading(false);
      setSuccess(true);
      alert("You became a buddy!");
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  

  return (
    //we use options for easier use and saving in the database
    <div className="wrapper container-fluid-becomebuddy ">
      <div className='row'>
        <div className="col-lg-7 col-md-4 col-sm-12">
          <div className="becomebuddy-image">
            <img src={becomebuddyimg} alt="" className="img-fluid"/>
          </div>
        </div>

        <div className='col-lg-4 col-md-8 col-sm-'>
          <form onSubmit={handleSubmit}>
            <h1>BECOME BUDDY</h1>
            <div className="form-group input-box">
              <label htmlFor="gender">Gender:</label>
              <select id="gender" className="form-control" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group input-box">
              <label htmlFor="age">Age:</label>
              <select id="age" className="form-control" name="age" value={formData.age} onChange={handleChange}>
                <option value="">Select Age Range</option>
                <option value="13-18">13-18</option>
                <option value="18-23">18-23</option>
                <option value="23+">23+</option>
              </select>
            </div>
            <div className="form-group input-box">
              <label htmlFor="subjectToTeach">Subject to Teach:</label>
              <select id="subjectToTeach" className="form-control" name="subjectToTeach" value={formData.subjectToTeach} onChange={handleChange}>
                <option value="">Select Subject to Teach</option>
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
            <div className="form-group input-box">
              <label htmlFor="preferredLanguage">Preferred Language:</label>
              <select id="preferredLanguage" className="form-control" name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange}>
              <option value="">Select Preferred Language</option>
              <option value="AKAN">Akan</option>
<option value="AMHARIC">Amharic</option>
<option value="ARABIC">Arabic</option>
<option value="AZERBAIJANI">Azerbaijani</option>
<option value="BELARUSAN">Belarusan</option>
<option value="BENGALI">Bengali</option>
<option value="BULGARIAN">Bulgarian</option>
<option value="BURMESE">Burmese</option>
<option value="CHINESE">Chinese</option>
<option value="CHITTAGONIAN">Chittagonian</option>
<option value="CZECH">Czech</option>
<option value="DUTCH">Dutch</option>
<option value="ENGLISH">English</option>
<option value="FARSI">Farsi</option>
<option value="FRENCH">French</option>
<option value="GERMAN">German</option>
<option value="GREEK">Greek</option>
<option value="HAUSA">Hausa</option>
<option value="HINDI">Hindi</option>
<option value="HUNGARIAN">Hungarian</option>
<option value="ITALIAN">Italian</option>
<option value="JAPANESE">Japanese</option>
<option value="KAZAKH">Kazakh</option>
<option value="KHMER">Khmer</option>
<option value="KOREAN">Korean</option>
<option value="MALAGASY">Malagasy</option>
<option value="MALAY">Malay</option>
<option value="MANDARIN">Mandarin</option>
<option value="NEPALI">Nepali</option>
<option value="PASHTO">Pashto</option>
<option value="POLISH">Polish</option>
<option value="PORTUGUESE">Portuguese</option>
<option value="ROMANIAN">Romanian</option>
<option value="RUSSIAN">Russian</option>
<option value="RWANDA">Rwanda</option>
<option value="SERBO-CROATIAN">Serbo-Croatian</option>
<option value="SHONA">Shona</option>
<option value="SINHALA">Sinhala</option>
<option value="SPANISH">Spanish</option>
<option value="SOMALI">Somali</option>
<option value="SUNDA">Sunda</option>
<option value="SWEDISH">Swedish</option>
<option value="TAGALOG">Tagalog</option>
<option value="TELUGU">Telugu</option>
<option value="THAI">Thai</option>
<option value="TURKISH">Turkish</option>
<option value="UKRAINIAN">Ukrainian</option>
<option value="URDU">Urdu</option>
<option value="UZBEK">Uzbek</option>
<option value="VIETNAMESE">Vietnamese</option>
<option value="YORUBA">Yoruba</option>
<option value="ZULU">Zulu</option>

              </select>
            </div>
            <button type="submit" className="button btn btn-primary becomebuddy-btn" disabled={loading}>
                {loading ? "Submitting..." : "BECOME BUDDY"}
              </button>
            
          </form>
          <span className="bb-back-link">Changed your mind? <Link to="/home">Go back</Link></span>
        </div>
      </div>
    </div>
  );
};

export default BecomeBuddy;
