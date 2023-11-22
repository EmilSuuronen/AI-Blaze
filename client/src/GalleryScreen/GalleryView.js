import React from "react";
import Navbar from "../HomeScreen/Navbar";
import MainContent from "../HomeScreen/Maincontent";

function GalleryView({ recentProjects }) {
  return (
    <div>
      <Navbar />
      <MainContent recentProjects={recentProjects} />
    </div>
  );
}
