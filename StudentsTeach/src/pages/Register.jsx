import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import attachImage from '../img/attachImage.png';
import signup from '../img/sign-up-picture.png';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const displayName = e.target.displayName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const file = e.target.file.files[0];
    const subject = e.target.subject.value;
    const education = e.target.education.value;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
              subject,
              education,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/login");
          } catch (error) {
            console.log("Error:", error);
            setLoading(false);
          }
        });
      });
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="wrapper container-fluid-signup min-vh-100">
       <div className="row">
       <div className="col-lg-7 col-md-4 col-sm-12 min-vh-100">
                <div className="signup-image">
                    <img src={signup} alt="" className="img-fluid"/>
                </div>
            </div>
            <div className='col-lg-4 col-md-8 col-sm-0'>
      <form onSubmit={handleSubmit}>
        <h1>SIGN UP</h1>
        <div className="form-row">
                        <div className="form-group col-5">
                            <label htmlFor="inputEmail4">Email</label>
                            <input type="email" className="form-control" id="inputEmail4" placeholder="name@example.com" name="email" required/>
                        </div>
            <div className="form-group col-7">
                <label htmlFor="inlineFormInputGroup">Username</label>
                <label className="sr-only" htmlFor="inlineFormInputGroup">Username</label>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text">@</div>
                    </div>
                    <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Username" name='displayName' required/>
                    
                </div>
            </div>
        </div>

        <div className="form-group">
        <label htmlFor="inputPassword4">Password</label>
        <input type="password" className="form-control" id="inputPassword4" name='password'/>
    </div>

    <div className="form-row">
            <div className="form-group col-6">
                <label htmlFor="inputSubject">Subject</label>
                <select id="inputSubject" className="form-control" name='subject'>
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
        <div className="form-group col-6">
        <label htmlFor="inputEdu">Education</label>
        <select id="inputEdu" className="form-control" name='education'>
        <option value="Choose...">Choose...</option>
            <option value="High school student">High school student</option>
            <option value="Bachelor's degree">Bachelor's degree</option>
            <option value="Master's degree">Master's degree</option>
            <option value="Doctorate">Doctorate</option>
        </select>
      </div>

        </div>
        <input required style={{ display: "none" }} type="file" id="file" name="file" />
        <label htmlFor="file">
            <img src={attachImage} alt="" />
            <span>Add an avatar</span>
          </label>

        <div className="form-group form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
            <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
            <span className="reg register-link">Already have an account? <Link to="/login">Log In!</Link></span>
          </div>

          <button type="submit" className="btn btn-primary signup-btn " disabled={loading}>SIGN UP</button>
          {loading && "Uploading and compressing the image please wait..."}

      </form>
      </div>
      </div>
    </div>
  );
}

export default Register;
