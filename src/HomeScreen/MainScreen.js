import React from "react";
import Navbar from "./Navbar";
import InformationBox from "./Infobox";
import MainContent from "./Maincontent";
import { UserAuth } from "../context/AuthContext";

function MainScreen({ recentProjects }) {
  const { user } = UserAuth();

  const userData = user
    ? {
        email: user.email || "no email",
        someData: "Dummy data specific to the user",
      }
    : null;

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
