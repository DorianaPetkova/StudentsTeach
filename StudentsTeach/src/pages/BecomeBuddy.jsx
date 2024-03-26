import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, storage } from "../firebase";
import becomebuddyimg from '../img/become-buddy-img.png';

const BecomeBuddy = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    subjectToTeach: '',
    preferredLanguage: ''
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      setUser(userAuth);
    });

    return () => unsubscribe();
  }, []);

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

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data();
      const { subjectToTeach, gender, age, preferredLanguage } = formData;

      await setDoc(doc(db, "buddies", user.uid), {
        uid: user.uid,
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL,
        subject: subjectToTeach,
        education: userData.education,
        gender,
        age,
        preferredLanguage,
      });

      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="wrapper container-fluid-login min-vh-100">
      <div className='row'>
        <div className="col-lg-7 col-md-4 col-sm-12 min-vh-100">
          <div className="login-image">
            <img src={becomebuddyimg} alt="" className="img-fluid"/>
          </div>
        </div>
        <div className='col-lg-4 col-md-8 col-sm-'>
          <form onSubmit={handleSubmit}>
            <h1>Become a Buddy</h1>
            <div className="form-group input-box">
              <label htmlFor="gender">Gender:</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group input-box">
              <label htmlFor="age">Age:</label>
              <select id="age" name="age" value={formData.age} onChange={handleChange}>
                <option value="">Select Age Range</option>
                <option value="13-18">13-18</option>
                <option value="18-23">18-23</option>
                <option value="23+">23+</option>
              </select>
            </div>
            <div className="form-group input-box">
              <label htmlFor="subjectToTeach">Subject to Teach:</label>
              <select id="subjectToTeach" name="subjectToTeach" value={formData.subjectToTeach} onChange={handleChange}>
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
              <select id="preferredLanguage" name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange}>
              <option value="">Select Preferred Language</option>
              <option value="AKAN">AKAN</option>
              <option value="AMHARIC">AMHARIC</option>
              <option value="ARABIC">ARABIC</option>
              <option value="AZERBAIJANI">AZERBAIJANI</option>
              <option value="BELARUSAN">BELARUSAN</option>
              <option value="BENGALI">BENGALI</option>
              <option value="BULGARIAN">BULGARIAN</option>
              <option value="BURMESE">BURMESE</option>
              <option value="CHINESE">CHINESE</option>
              <option value="CHITTAGONIAN">CHITTAGONIAN</option>
              <option value="CZECH">CZECH</option>
              <option value="DUTCH">DUTCH</option>
              <option value="ENGLISH">ENGLISH</option>
              <option value="FARSI">FARSI</option>
              <option value="FRENCH">FRENCH</option>
              <option value="GERMAN">GERMAN</option>
              <option value="GREEK">GREEK</option>
              <option value="HAUSA">HAUSA</option>
              <option value="HINDI">HINDI</option>
              <option value="HUNGARIAN">HUNGARIAN</option>
              <option value="ITALIAN">ITALIAN</option>
              <option value="JAPANESE">JAPANESE</option>
              <option value="KAZAKH">KAZAKH</option>
              <option value="KHMER">KHMER</option>
              <option value="KOREAN">KOREAN</option>
              <option value="MALAGASY">MALAGASY</option>
              <option value="MALAY">MALAY</option>
              <option value="MANDARIN">MANDARIN</option>
              <option value="NEPALI">NEPALI</option>
              <option value="PASHTO">PASHTO</option>
              <option value="POLISH">POLISH</option>
              <option value="PORTUGUESE">PORTUGUESE</option>
              <option value="ROMANIAN">ROMANIAN</option>
              <option value="RUSSIAN">RUSSIAN</option>
              <option value="RWANDA">RWANDA</option>
              <option value="SERBO-CROATIAN">SERBO-CROATIAN</option>
              <option value="SHONA">SHONA</option>
              <option value="SINHALA">SINHALA</option>
              <option value="SPANISH">SPANISH</option>
              <option value="SOMALI">SOMALI</option>
              <option value="SUNDA">SUNDA</option>
              <option value="SWEDISH">SWEDISH</option>
              <option value="TAGALOG">TAGALOG</option>
              <option value="TELUGU">TELUGU</option>
              <option value="THAI">THAI</option>
              <option value="TURKISH">TURKISH</option>
              <option value="UKRAINIAN">UKRAINIAN</option>
              <option value="URDU">URDU</option>
              <option value="UZBEK">UZBEK</option>
              <option value="VIETNAMESE">VIETNAMESE</option>
              <option value="YORUBA">YORUBA</option>
              <option value="ZULU">ZULU</option>

              </select>
            </div>
            <button type="submit" className="button btn btn-primary login-btn" disabled={loading}>
              {loading ? "Submitting..." : "BECOME BUDDY"}
            </button>
            
          </form>
          <span className="reg register-link">Changed your mind? <Link to="/">Go back</Link></span>
        </div>
      </div>
    </div>
  );
};

export default BecomeBuddy;
