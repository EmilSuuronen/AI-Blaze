import React from "react";
import Navbar from "./Navbar";
import InformationBox from "./Infobox";
import MainContent from "./Maincontent";

function MainScreen({ recentProjects }) {
  return (
    <div>
      <Navbar />
      <InformationBox infoText="Your Information" />
      <MainContent recentProjects={recentProjects} />
    </div>
  );
}

export default MainScreen;
