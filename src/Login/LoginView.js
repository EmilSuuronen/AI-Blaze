import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";

function LoginView() {
  return (
    <div>
      <div className="container">
        <h1 className="heading">AI-Blaze</h1>
        <input type="text" className="input" placeholder="Username" />
        <input type="password" className="input" placeholder="Password" />
        <button className="button">Login</button>
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
