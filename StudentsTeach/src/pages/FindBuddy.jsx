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
    const q = query(collection(db, "buddies"));
    
    try {
      const querySnapshot = await getDocs(q);
      const results = [];
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let matchCount = 0;
  
        // we count the matches of the criteria so we can sort them based on the number later
        if (data.preferredLanguage === language) matchCount++;
        if (data.gender === gender) matchCount++;
        if (data.subject === subject) matchCount++;
        if (data.age === age) matchCount++;
        if (data.education === education) matchCount++;
        
        
        const { bio, ...userData } = data;
  
        // the user is added even if one criteria matches but they are displayed at the bottom
        if (matchCount > 0) {
          results.push({ ...userData, bio, matchCount });
        }
      });
  
     
      results.sort((a, b) => b.matchCount - a.matchCount);
  
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching buddies: ", error);
    }
  };
  

  
  return (
    //again we use options to not overcomplicate things
    <div className="find-buddy">
     
      <div className="wrapper container-fluid-login">
      <div className='row'>
        <div className="col-lg-5 col-md-6 col-sm-12">
          <h2>FIND BUDDIES</h2>
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
        FIND BUDDIES
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
                <strong className="findB-desc">Bio:</strong> {result.bio}
              </p>
              <p>
               
              </p>
              
            </div>
          </div>
        ))}
      </div>
      
      </div>
      <span className="fb back-link">Changed your mind? <Link to="/home">Go back</Link></span>
      </div>
      </div>
    </div>
  );
};

export default FindBuddy;
