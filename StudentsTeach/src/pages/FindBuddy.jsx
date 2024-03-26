import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";



const SearchBuddy = () => {
  const [criteria, setCriteria] = useState({
    gender: "",
    language: "",
    subject: "",
    age: "",
    education: "",
  });
  const [buddies, setBuddies] = useState([]);

  const handleSearch = async () => {
    try {
      let q = collection(db, "buddies");

      // Add where clauses for each criterion if it's not empty
      if (criteria.gender !== "") {
        q = query(q, where("gender", "==", criteria.gender));
      }
      if (criteria.language !== "") {
        q = query(q, where("preferredLanguage", "==", criteria.language));
      }
      if (criteria.subject !== "") {
        q = query(q, where("subject", "==", criteria.subject));
      }
      if (criteria.age !== "") {
        q = query(q, where("age", "==", criteria.age));
      }
      if (criteria.education !== "") {
        q = query(q, where("education", "==", criteria.education));
      }

      const querySnapshot = await getDocs(q);
      const matchedBuddies = [];
      querySnapshot.forEach((doc) => {
        matchedBuddies.push(doc.data());
      });
      setBuddies(matchedBuddies);
      console.log("successful search");
      console.log(criteria.gender)
    } catch (error) {
      console.error("Error searching for buddies:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriteria((prevCriteria) => ({
      ...prevCriteria,
      [name]: value,
    }));
  };

  return (
    <div className="search-buddy">
      <h2>Search for Buddies</h2>
      <div>
        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          name="gender"
          value={criteria.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="language">Language:</label>
        <input
          type="text"
          id="language"
          name="language"
          value={criteria.language}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={criteria.subject}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="age">Age:</label>
        <input
          type="text"
          id="age"
          name="age"
          value={criteria.age}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="education">Education:</label>
        <input
          type="text"
          id="education"
          name="education"
          value={criteria.education}
          onChange={handleChange}
        />
      </div>
      <button onClick={handleSearch}>Search</button>

      <div className="buddy-results">
        <h3>Search Results</h3>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Country</th>
              <th>Age</th>
              <th>Education</th>
            </tr>
          </thead>
          <tbody>
          {buddies.map((buddy, index) => (
  <tr key={index}>
    <td>{JSON.stringify(buddy)}</td>
  </tr>
))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchBuddy;
