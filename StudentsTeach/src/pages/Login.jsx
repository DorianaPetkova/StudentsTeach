import React from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import { auth } from "../firebase";


import loginimg from '../img/log-in-img.png';

const login = () => {
  const navigate = useNavigate();
  //checking if the user exists using firebase authentication with email and password
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try 
    {
       await signInWithEmailAndPassword(auth, email, password);
        navigate("/home");
     
    } catch (error) 
    {
        const errorCode = error.code;
        const errorMessage = error.message;
       
      console.log("ERROR", error.code)
    }
}

  return (
    
    <div className="wrapper container-fluid-login min-vh-100">
      <div className='row'>

      <div className="col-lg-7 col-md-4 col-sm-12 min-vh-100">
            <div className="login-image">
              <img src={loginimg} alt="" className="img-fluid"/>
              
            </div>
        </div>
        <div className='col-lg-4 col-md-8 col-sm-0'>
    <form onSubmit={handleSubmit}>
      <h1>LOG IN</h1>

      <div className="form-group input-box">
           <label htmlFor="InputEmail">Email</label>
           <input type="email" className="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="name@example.com" required/>
           <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else... Maybe.</small>
       </div>

       <div className="form-group input-box">
                      <label htmlFor="exampleInputPassword1">Password</label>
                      <input type="password" className="form-control" id="exampleInputPassword1" required/>
                    </div>

                    <button type="submit" className="button btn btn-primary login-btn">LOG IN</button>

      <div className="form-group form-check">
                      <span className="reg register-link">Don't have an account? <Link to="/register">Sign up!</Link></span>
                    </div>
      
    </form>
    </div>
    </div>
  </div>
  )
}

export default login