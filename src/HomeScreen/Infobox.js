import React, { useEffect, useState } from "react";
import "./InfoBox.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Button } from "@mui/material";
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

  return (
    <div className="info_container">
      {user && (
        <p>
          Welcome, {user.email}, id: {user.uid}!
        </p>
      )}
      <div className="separator" />
      <div className="infoButtonContainer">
        <Link to="/galleryView">
          <Button
            style={{
              backgroundColor: "rgba(79,81,140,1)",
              color: "#fffffa"
            }}
            className="infoBoxButton"
            size="medium"
            variant="contained"
          >
            Gallery
          </Button>
        </Link>
        <div className="separator2" />
        <Link to="/createNewProject">
          <Button
            style={{
              backgroundColor: "rgba(79,81,140,1)",
              color: "#fffffa",
            }}
            className="infoBoxButton"
            size="medium"
            variant="contained"
          >
            New Project
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InformationBox;
