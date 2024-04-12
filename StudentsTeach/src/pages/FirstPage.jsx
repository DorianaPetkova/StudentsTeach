import React from 'react';
import { Link } from 'react-router-dom';

import navlogo from "../img/nav-logo.png";
import firstp from "../img/distance-learning-6.png"


const FirstPage = () => {
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <Link className="navbar-brand" to="/"><img src={navlogo} alt="home_logo" /></Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <Link className="nav-link" to="#adv">Advantages</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">How to use?<span className="sr-only">(current)</span></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">About us<span className="sr-only">(current)</span></Link>
              </li>
            </ul>
            
            <div className="sign-up-navbar">
              <Link className="sign-up-navbar" to="/register">
                  <button className="btn btn-primary signup-btn nb">SIGN UP</button>
              </Link>
            </div>

            <div className="log-in-navbar">
              <Link className="log-in-navbar" to="/login">
                  <button className="btn btn-primary login-btn nb">LOG IN</button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="container-fluid-Motivating-quote min-vh-100">
        <div className="row">
          <div className="col-lg-4 col-md-5 col-sm-12 fp">
            <h2 className="first-page-no-accent"><span className="first-page-accent">Learn</span>, <span className="first-page-accent">teach</span>, <span className="first-page-accent">inspire</span>: the only learning service, where students inspire each other to learn and grow.</h2>
          </div>
          <div className="col-lg-8 col-md-7 col-sm-12 min-vh-100">
            <div className="first-page-image">
              <img src={firstp} alt="" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>

      <div className="about-service">
        <p>This website was created so that students from all over the world could <span className="accent-abt">study together</span> <br />and better each other.
          <br />StudentsTeach is just what the name emplies - students in both university and high-school <span className="accent-abt"><br />give knowledge</span> to their peers about topics that they're interested in.
          <br />The website has the objective to <span className="accent-abt">make studying and communication easier.</span> </p>
      </div>

      <hr className="line" id="adv" />

      <div className="container-fluid-advantages" >
        <h3 className="text-center" style={{ textDecoration: 'underline' }}>Advantages</h3>
        <div className="row">
          <div className="col-lg-4 col-md-4 col-sm-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="check" viewBox="0 0 16 16">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
            </svg>
            <p className="advantages-list">Easy to use</p>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="whiteboard" viewBox="0 0 16 16">
              <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"/>
              <path d="M2 4.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H3v2.5a.5.5 0 0 1-1 0zm12 7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H13V8.5a.5.5 0 0 1 1 0z"/>
            </svg>
            <p className="advantages-list">Whiteboard function</p>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12" >
            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="loop" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
            <p className="advantages-list" >Searching a buddy function</p>
          </div>
        </div>
      </div>

      <div className="container-fluid-expect">
        <h3 className="text-center" style={{ textDecoration: 'underline' }}>What to expect from StudentsTeach?</h3>
        <p className="expectations">After registration, the <span className="accent-abt">user will be able to: </span></p>
        <p className="expectations-list"> ✓ view their chats <br /> ✓ modify their profile<br /> ✓ search for a study buddy to help with their chosen subject 
          <br /> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="plus" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
          </svg> There is a whiteboard function, through which students can<span className="accent-wtex"> simplify their explanations</span> and <span className="accent-wtex">save</span> their materials for later review. </p>
      </div>
    </>
  );
};

export default FirstPage;
