import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import InformationBox from "./Infobox";
import MainContent from "./Maincontent";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

function MainScreen({ recentProjects }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const uid = authUser.uid;
        console.log("uid", uid);
        setUser(authUser);

        // Dummy user-specific data
        const dummyUserData = {
          email: authUser.email || "guest@example.com",
          someData: "Dummy data specific to the user", // change this to project name
        };

        setUserData(dummyUserData);
      } else {
        console.log("User logged out");
        setUser(null);
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Navbar />
      {user ? (
        <div>
          <InformationBox infoText="Your Information" />
          <MainContent recentProjects={recentProjects} />
          {userData && (
            <div>
              <p>Welcome, {user.uid}!</p>
              <p>Your specific data: {userData.someData}</p>
            </div>
          )}
        </div>
      ) : (
        <p>Please sign in to access this content.</p>
      )}
    </div>
  );
}

export default MainScreen;
