import React, { useEffect, useState } from "react";
import "./InfoBox.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link } from "react-router-dom";

function InformationBox({ infoText }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Function to extract the part of the email before "@"
  const getEmailPrefix = (email) => {
    if (email) {
      const parts = email.split("@")
      if (parts.length === 2) {
        return parts[0]; // Get the part before "@"
      }
    }
    return "";
  };

  return (
    <div className="info_container">
      {user && (
        <p className="paragraph--text">
          Welcome,{" "}
          <p className="text-welcome-name">{getEmailPrefix(user.email)} </p>
        </p>
      )}
      <div className="separator" />
      <div className="infoButtonContainer">
        <Link to="/galleryView"></Link>
        <div className="separator2" />
      </div>
    </div>
  );
}

export default InformationBox;
