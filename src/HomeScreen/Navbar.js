import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div className="navbar">
      <span className="appName">AI-Blaze</span>
      <button onClick={() => setDropdownVisible(!dropdownVisible)}>☰</button>
      {dropdownVisible && (
        <div className="dropdown">
          <Link>
            <button onClick={() => console.log("Gallery")}>Gallery</button>
          </Link>
          <Link to="/createNewProject">
            <button onClick={() => console.log("New Project")}>
              New Project (Emil)
            </button>
          </Link>
          <Link to="/newProjectView">
            <button onClick={() => console.log("New Project")}>
              New Project (Ying)
            </button>
          </Link>
          <Link to="/editview">
            <button onClick={() => console.log("Edit View")}>Edit</button>
          </Link>
          <Link to="/">
            <button onClick={() => console.log("Signout")}>Signout</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
