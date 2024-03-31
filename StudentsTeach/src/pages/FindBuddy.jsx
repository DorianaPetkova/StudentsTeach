import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const SearchBuddy = () => {
  // State variables for selected search criteria
  const [gender, setGender] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [subjectToTeach, setSubjectToTeach] = useState("");
  const [education, setEducation] = useState("");
  const [age, setAge] = useState("");

  // State variable to store search results
  const [searchResults, setSearchResults] = useState([]);

  // Function to handle search operation
  const handleSearch = async () => {
    try {
      // Construct Firebase query based on selected criteria
      let q = collection(db, "buddies");

      if (gender) {
        q = query(q, where("gender", "==", gender));
      }

      if (preferredLanguage) {
        q = query(q, where("preferredLanguage", "==", preferredLanguage));
      }

      if (subjectToTeach) {
        q = query(q, where("subject", "==", subjectToTeach));
      }

      if (education) {
        q = query(q, where("education", "==", education));
      }

      if (age) {
        q = query(q, where("age", "==", age));
      }

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Extract data from query results
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
        console.log("search successful!");
        console.log(results);
      });

      // Update search results state
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching for buddies:", error);
    }
  };

  return (
    <div className="search-buddy">
      <h2>Search for Buddies</h2>
      <div>
        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Choose...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="form-group input-box">
        <label htmlFor="preferredLanguage">Preferred Language:</label>
        <select
          id="preferredLanguage"
          name="preferredLanguage"
          value={preferredLanguage}
          onChange={(e) => setPreferredLanguage(e.target.value)}
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
        <label htmlFor="subjectToTeach">Subject to Teach:</label>
        <select
          id="subjectToTeach"
          name="subjectToTeach"
          value={subjectToTeach}
          onChange={(e) => setSubjectToTeach(e.target.value)}
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
        <label htmlFor="inputEdu">Education</label>
        <select
          id="inputEdu"
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
      <div className="form-group input-box">
        <label htmlFor="inputAge">Age</label>
        <select
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
      <button onClick={handleSearch}>Search</button>

      {/* Render search results */}
      {searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                
                {result.displayName} - {result.subject}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBuddy;
