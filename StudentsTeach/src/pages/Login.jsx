import React from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import { auth } from "../firebase";


import loginimg from '../img/log-in-img.png';

const login = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    

    try 
    {
       await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
     
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
<div className='col-lg-4 col-md-8 col-sm-'>
    <form onSubmit={handleSubmit}>
      <h1>LOG IN</h1>

      <div className="form-group input-box">
           <label htmlFor="InputEmail">Email</label>
           <input type="email" className="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="name@example.com" required/>
           <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
       </div>

       <div className="form-group input-box">
                      <label htmlFor="exampleInputPassword1">Password</label>
                      <input type="password" className="form-control" id="exampleInputPassword1" required/>
                    </div>

                    <div className="form-group form-check">
                      <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                      <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
                      <span className="reg register-link">Don't have an account? <Link to="/register">Sign up!</Link></span>
                    </div>


      {/*<div className="input-box">
        <input type="email" placeholder="Email" required />
        <i className='bx bx-user'></i>
      </div>
      <div className="input-box">
        <input type="password" placeholder="Password" required />
        <i className='bx bx-lock-alt'></i>
  </div>*/}
      <button type="submit" className="button btn btn-primary login-btn">LOG IN</button>
      
    </form>
    </div>
    </div>
  </div>
  )
}

export default login