import React, { useEffect, useState } from "react";
import "./InfoBox.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

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
      const parts = email.split("@");
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
          Welcome, {getEmailPrefix(user.email)} , id (dev purposes): {user.uid}!
        </p>
      )}
      {/* Remove or comment out the separator and button/link elements */}
    </div>
  );
}

export default InformationBox;
