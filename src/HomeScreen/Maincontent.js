// MainContent.js

import React from "react";
import "./MainContent.css";

function MainContent({ recentProjects }) {
  return (
    <div className="mainContent">
      <h2 className="recentProjectsText">Your Recent Projects</h2>
      <div className="projectImages">
        {recentProjects && recentProjects.map((project, index) => (
          <div key={index} className="projectImage">
            <img src={project.image} alt={project.filename} className="image" />
            <p className="fileNameText">{project.filename}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainContent;
