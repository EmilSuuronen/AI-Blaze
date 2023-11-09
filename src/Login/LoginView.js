import React, {useEffect, useState} from "react";
import "./Login.css";
import {auth, provider} from "../GoogleSignin/config";
import {signInWithPopup} from "firebase/auth";
import { Link } from "react-router-dom";

function LoginView() {
  const [value, setValue] = useState('')

  const handleClick = () => {
    signInWithPopup(auth, provider).then((data)=>{
      setValue(data.user.email)
      localStorage.setItem("email", data.user.email)
    })
  }

  useEffect(() => {
    setValue(localStorage.getItem("email"))
  })

  return (
    <div>
      <div className="container">
        <h1 className="heading">AI-Blaze</h1>
        <input type="text" className="input" placeholder="Username" />
        <input type="password" className="input" placeholder="Password" />
        <button className="button">Login</button>
        <button onClick={handleClick}>Signin with Google</button>
        {value}
      </div>
      <div>
        <hr className="hr" />
        <p className="or">OR</p>
      </div>
      <div className="container2">
        <button className="google">Need an account? SIGN UP</button>
        <Link to="/">
          <button>Back</button>
        </Link>
      </div>
    </div>
  );
}

export default LoginView;
