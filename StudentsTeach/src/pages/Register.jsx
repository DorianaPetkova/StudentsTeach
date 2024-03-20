import React, {useState} from 'react';
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


  const handleSubmit = async (e) => 
  {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => 
        {
          try 
          {
            //Update profile
            await updateProfile(res.user, 
              {
              displayName,
              photoURL: downloadURL,
            });
            //create user 
            await setDoc(doc(db, "users", res.user.uid), 
            {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats 
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/login");
          } catch (error) 
          {
            console.log("wrong");
            setLoading(false);
          }
        });
      });
    } catch (error) 
    {
      console.log("wrong");
      
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
                            <label for="inputEmail4">Email</label>
                            <input type="email" className="form-control" id="inputEmail4" placeholder="name@example.com" name="email" required/>
                        </div>
            <div className="form-group col-7">
                <label for="inputUsername">Username</label>
                <label className="sr-only" for="inlineFormInputGroup">Username</label>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text">@</div>
                    </div>
                    <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Username" name='username' required/>
                    
                </div>
            </div>
        </div>

        <div className="form-group">
        <label for="inputPassword4">Password</label>
        <input type="password" className="form-control" id="inputPassword4"/>
    </div>

    <div className="form-row">
            <div className="form-group col-6">
                <label for="inputSubject">Subject</label>
                <select id="inputSubject" className="form-control">
                    <option selected>Any</option>
                    <option>Arts&Culture</option>
                    <option>Biology</option>
                    <option>Chemistry</option>
                    <option>Computer Science</option>
                    <option>Electronics</option>
                    <option>Engineering</option>
                    <option>Food&nutrition</option>
                    <option>History</option>
                    <option>Language</option>
                    <option>Law</option>
                    <option>Literature</option>
                    <option>Math</option>
                    <option>Medicine</option>
                    <option>Music</option>
                    <option>Philosophy</option>
                    <option>Physics</option>
                    <option>Social Science</option>
                </select>
        </div>
        <div className="form-group col-6">
        <label for="inputEdu">Education</label>
        <select id="inputEdu" className="form-control">
          <option selected>Choose...</option>
          <option>High school student</option>
          <option>Bachelor's degree</option>
        <option>Master's degree</option>
        <option>Doctorate</option>
        </select>
      </div>

        </div>
        <input required style={{ display: "none" }} type="file" id="file" />
        <label htmlFor="file">
            <img src={attachImage} alt="" />
            <span>Add an avatar</span>
          </label>

        <div className="form-group form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
            <label className="form-check-label" for="exampleCheck1">Remember me</label>
            <span className="reg register-link">Already have an account? <Link to="/login">Log In!</Link></span>
          </div>

          <button type="submit" className="btn btn-primary signup-btn " disabled={loading}>SIGN UP</button>
          {loading && "Uploading and compressing the image please wait..."}




        {/*<div className="input-box">
          <input type="text" name="displayName" placeholder="Username" required />
          <i className='bx bx-user'></i>
        </div>
        <div className="input-box">
          <input type="text" name="email" placeholder="Email" required />
          <i className='bx bx-envelope'></i>
        </div>
        <div className="input-box">
          <input type="password" name="password" placeholder="Password" required />
          <i className='bx bx-lock-alt'></i>
        </div>
        <input required style={{ display: "none" }} type="file" id="file" />
        <label htmlFor="file">
            <img src={attachImage} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          
        <div className="register-link">
          <p>Already have an account? <Link to="/login">Log In!</Link></p>
  </div>*/}
      </form>
      </div>
      </div>
    </div>
  );
}


export default Register;
