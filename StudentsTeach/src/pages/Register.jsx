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
    const country = e.target.country.value;

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
                        country,
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

// Add event listener to the file input element to update label text
document.addEventListener('DOMContentLoaded', function() {
    var fileInput = document.getElementById('file');
    var fileLabel = document.querySelector('.custom-file-upload');

    fileInput.addEventListener('change', function() {
        var fileName = 'No file chosen';
        if (this.files && this.files.length > 0) {
            fileName = this.files[0].name;
        }
        fileLabel.textContent = fileName;
    });
});


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

        <div className="form-row">
        <div className="form-group col-6">
            <label htmlFor="inputSubject">Country</label>
            <select id="inputSubject" className="form-control" name='country'>
  <option value="Any">Any</option>
  <option value="Afghanistan">Afghanistan</option>
  <option value="Albania">Albania</option>
  <option value="Algeria">Algeria</option>
  <option value="Andorra">Andorra</option>
  <option value="Angola">Angola</option>
  <option value="Antigua and Barbuda">Antigua and Barbuda</option>
  <option value="Argentina">Argentina</option>
  <option value="Armenia">Armenia</option>
  <option value="Australia">Australia</option>
  <option value="Austria">Austria</option>
  <option value="Azerbaijan">Azerbaijan</option>
  <option value="Bahamas">Bahamas</option>
  <option value="Bahrain">Bahrain</option>
  <option value="Bangladesh">Bangladesh</option>
  <option value="Barbados">Barbados</option>
  <option value="Belarus">Belarus</option>
  <option value="Belgium">Belgium</option>
  <option value="Belize">Belize</option>
  <option value="Benin">Benin</option>
  <option value="Bhutan">Bhutan</option>
  <option value="Bolivia">Bolivia</option>
  <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
  <option value="Botswana">Botswana</option>
  <option value="Brazil">Brazil</option>
  <option value="Brunei">Brunei</option>
  <option value="Bulgaria">Bulgaria</option>
  <option value="Burkina Faso">Burkina Faso</option>
  <option value="Burundi">Burundi</option>
  <option value="Cabo Verde">Cabo Verde</option>
  <option value="Cambodia">Cambodia</option>
  <option value="Cameroon">Cameroon</option>
  <option value="Canada">Canada</option>
  <option value="Central African Republic">Central African Republic</option>
  <option value="Chad">Chad</option>
  <option value="Chile">Chile</option>
  <option value="China">China</option>
  <option value="Colombia">Colombia</option>
  <option value="Comoros">Comoros</option>
  <option value="Congo (Congo-Brazzaville)">Congo (Congo-Brazzaville)</option>
  <option value="Costa Rica">Costa Rica</option>
  <option value="Croatia">Croatia</option>
  <option value="Cuba">Cuba</option>
  <option value="Cyprus">Cyprus</option>
  <option value="Czechia (Czech Republic)">Czechia (Czech Republic)</option>
  <option value="Denmark">Denmark</option>
  <option value="Djibouti">Djibouti</option>
  <option value="Dominica">Dominica</option>
  <option value="Dominican Republic">Dominican Republic</option>
  <option value="Ecuador">Ecuador</option>
  <option value="Egypt">Egypt</option>
  <option value="El Salvador">El Salvador</option>
  <option value="Equatorial Guinea">Equatorial Guinea</option>
  <option value="Eritrea">Eritrea</option>
  <option value="Estonia">Estonia</option>
  <option value="Eswatini (fmr. 'Swaziland')">Eswatini (fmr. 'Swaziland')</option>
  <option value="Ethiopia">Ethiopia</option>
  <option value="Fiji">Fiji</option>
  <option value="Finland">Finland</option>
  <option value="France">France</option>
  <option value="Gabon">Gabon</option>
  <option value="Gambia">Gambia</option>
  <option value="Georgia">Georgia</option>
  <option value="Germany">Germany</option>
  <option value="Ghana">Ghana</option>
  <option value="Greece">Greece</option>
  <option value="Grenada">Grenada</option>
  <option value="Guatemala">Guatemala</option>
  <option value="Guinea">Guinea</option>
  <option value="Guinea-Bissau">Guinea-Bissau</option>
  <option value="Guyana">Guyana</option>
  <option value="Haiti">Haiti</option>
  <option value="Holy See">Holy See</option>
  <option value="Honduras">Honduras</option>
  <option value="Hungary">Hungary</option>
  <option value="Iceland">Iceland</option>
  <option value="India">India</option>
  <option value="Indonesia">Indonesia</option>
  <option value="Iran">Iran</option>
  <option value="Iraq">Iraq</option>
  <option value="Ireland">Ireland</option>
  <option value="Israel">Israel</option>
  <option value="Italy">Italy</option>
  <option value="Jamaica">Jamaica</option>
  <option value="Japan">Japan</option>
  <option value="Jordan">Jordan</option>
  <option value="Kazakhstan">Kazakhstan</option>
  <option value="Kenya">Kenya</option>
  <option value="Kiribati">Kiribati</option>
  <option value="Kuwait">Kuwait</option>
  <option value="Kyrgyzstan">Kyrgyzstan</option>
  <option value="Laos">Laos</option>
  <option value="Latvia">Latvia</option>
  <option value="Lebanon">Lebanon</option>
  <option value="Lesotho">Lesotho</option>
  <option value="Liberia">Liberia</option>
  <option value="Libya">Libya</option>
  <option value="Liechtenstein">Liechtenstein</option>
  <option value="Lithuania">Lithuania</option>
  <option value="Luxembourg">Luxembourg</option>
  <option value="Madagascar">Madagascar</option>
  <option value="Malawi">Malawi</option>
  <option value="Malaysia">Malaysia</option>
  <option value="Maldives">Maldives</option>
  <option value="Mali">Mali</option>
  <option value="Malta">Malta</option>
  <option value="Marshall Islands">Marshall Islands</option>
  </select>


    </div>

    <div className="form-group col-6">
        <label htmlFor="inputAvatar">Avatar</label>
        <span className="custom-file-upload">
          <input type="file" id="file" name='file' className="form-control" accept="image/png, image/jpeg" />

        </span>
      </div>


        </div>





        {/*<input required style={{ display: "none" }} type="file" id="file" name="file" />
        <label htmlFor="file">
            <img src={attachImage} alt="" />
            <span>Add an avatar</span>
  </label>*/}

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
