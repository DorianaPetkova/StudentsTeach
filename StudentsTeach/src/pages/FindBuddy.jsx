import React, { useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
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
    try {
      const q = query(collection(db, "buddies"));
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

      // Filter the results based on the selected criteria
      const filteredResults = results.filter((result) => {
        // Check if the result matches at least one of the selected criteria
        return (
          (!language || result.preferredLanguage === language) ||
          (!gender || result.gender === gender) ||
          (!subject || result.subject === subject) ||
          (!age || result.age === age) ||
          (!education || result.education === education)
        );
      });

      // Sort the filtered results based on the number of matches
      filteredResults.sort((a, b) => {
        const aMatches = calculateMatches(a);
        const bMatches = calculateMatches(b);
        return bMatches - aMatches; // Sort in descending order
      });

      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error fetching buddies: ", error);
    }
  };

  // Helper function to calculate the number of matches for a result
  const calculateMatches = (result) => {
    let matches = 0;
    if (result.preferredLanguage === language) matches++;
    if (result.gender === gender) matches++;
    if (result.subject === subject) matches++;
    if (result.age === age) matches++;
    if (result.education === education) matches++;
    return matches;
  };

  return (
    <div className="find-buddy">
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

      <div>
        {searchResults.map((result, index) => (
          <div key={index} className="search-result">
            <img src={result.photoURL} alt="Profile" />
            <div>
              <p>
                <strong>Name:</strong> {result.displayName}
              </p>
              <p>
                <strong>Email:</strong> {result.email}
              </p>
              {/* Add more fields here if needed */}
            </div>
          </div>
        ))}
        <span className="reg register-link">Changed your mind? <Link to="/home">Go back</Link></span>
      </div>
    </div>
  );
};

export default FindBuddy;
