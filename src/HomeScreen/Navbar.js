import React, { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div className="navbar">
      <span className="appName">AI-Blaze</span>
      <button onClick={() => setDropdownVisible(!dropdownVisible)}>☰</button>
      {dropdownVisible && (
        <div className="dropdown">
          <button onClick={() => console.log("Gallery")}>Gallery</button>
          <button onClick={() => console.log("New Project")}>
            New Project
          </button>
          <button onClick={() => console.log("Signout")}>Signout</button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
