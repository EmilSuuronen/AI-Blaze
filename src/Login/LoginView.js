import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";

function LoginView() {
  return (
    <div>
      <Link to="/">
        <button>Back</button>
      </Link>
      <div className="container">
        <h1 className="heading">AI-Blaze</h1>
        <input type="text" className="input" placeholder="Username" />
        <input type="password" className="input" placeholder="Password" />
        <button className="button">Login</button>
      </div>
      <hr className="hr" />
      <p className="or">OR</p>
      <div className="container2">
        <button className="google">Need an account? SIGN UP</button>
      </div>
    </div>
  );
}

export default LoginView;
