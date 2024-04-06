import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, Link } from 'react-router-dom';

const FindBuddy = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [language, setLanguage] = useState("");
  const [gender, setGender] = useState("");
  const [subject, setSubject] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");

  const handleSearch = async () => {
    // Construct the query based on the selected language, gender, subject, age, and education
    const q = query(
      collection(db, "buddies"),
      // Use a combination of conditional checks to find users meeting at least one criteria
      where("preferredLanguage", "==", language || ""),
      where("gender", "==", gender || ""),
      where("subject", "==", subject || ""),
      where("age", "==", age || ""),
      where("education", "==", education || "")
    );

    try {
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Check if the user meets at least one of the criteria
        if (
          data.preferredLanguage === language ||
          data.gender === gender ||
          data.subject === subject ||
          data.age === age ||
          data.education === education
        ) {
          results.push(data);
        }
      });
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching buddies: ", error);
    }
  };

  
  return (
    <div className="find-buddy">
     
      <div className="wrapper container-fluid-login">
      <div className='row'>
        <div className="col-lg-5 col-md-6 col-sm-12">
          <h2>Find Buddies</h2>
         <div className="form-group input-box">
        <label htmlFor="preferredLanguage">Preferred Language:</label>
        <select
          className="form-control"
          id="preferredLanguage"
          name="preferredLanguage"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
         
         <option value="">Choose...</option>
         
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
      <div className="form-group input-box">
        <label htmlFor="gender">Gender:</label>
        <select
          className="form-control"
          id="gender"
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
           <option value="">Choose...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-group input-box">
        <label htmlFor="subject">Subject:</label>
        <select
          className="form-control"
          id="subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">Choose...</option>
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
        <label htmlFor="inputAge">Age:</label>
        <select
          className="form-control"
          id="inputAge"
          name="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        >
         <option value="Choose...">Choose...</option>
          <option value="<18">Under 18</option>
          <option value="18-23">18-23</option>
          <option value="23+">23+</option>
        </select>
      </div>
      <div className="form-group input-box">
        <label htmlFor="inputEducation">Education:</label>
        <select
          className="form-control"
          id="inputEducation"
          name="education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        >
           <option value="Choose...">Choose...</option>
          <option value="High school student">High school student</option>
          <option value="Bachelor's degree">Bachelor's degree</option>
          <option value="Master's degree">Master's degree</option>
          <option value="Doctorate">Doctorate</option>
        </select>
      </div>
      <button
        className="button btn btn-primary findbuddy-btn"
        onClick={handleSearch}
      >
        Search
      </button>
      </div>

      <div className="col-lg-7 col-md-6 col-sm-12">
      <div>
        {searchResults.map((result, index) => (
          <div key={index} className="search-result">
            <img className="img-findB" src={result.photoURL} alt="Profile" />
                 <strong className="findB-desc">Userame:</strong> {result.displayName}
                 <strong className="findB-desc">Gender:</strong> {result.gender}
                 <strong className="findB-desc">Age:</strong> {result.age}
            <div>
              <p>
                 <strong className="findB-desc">Language:</strong> {result.preferredLanguage}
                 <strong className="findB-desc">Subject:</strong> {result.subject}
                 <strong className="findB-desc">Education:</strong> {result.education}
              </p>
              <p>
               
              </p>
              {/* Add more fields here if needed */}
            </div>
          </div>
        ))}
      </div>
      
      </div>

         <span className="reg register-link">Changed your mind? <Link to="/">Go back</Link></span>
      </div>
      </div>
    </div>
  );
};

export default FindBuddy;
