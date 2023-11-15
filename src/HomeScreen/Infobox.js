import React, {useEffect, useState} from "react";
import "./InfoBox.css";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebaseConfig";

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
  }, [])

  return (
    <div className="container">
      {user && (<p>Welcome, {user.email}!</p>)}
      <div className="separator" />
    </div>
  );
}

export default InformationBox;
