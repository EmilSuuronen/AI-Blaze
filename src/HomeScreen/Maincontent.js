import React from "react";
import "./MainContent.css";
import {UserAuth} from "../context/AuthContext";

function MainContent({ recentProjects, userImages }) {
  const { user } = UserAuth();
  
  return (
    <div className="mainContent">
      {/* 
      <h2 className="recentProjectsText">Your Recent Projects</h2>
      <div className="projectImages">
        {recentProjects &&
          recentProjects.map((project, index) => (
            <div key={index} className="projectImage">
              <img
                src={project.image}
                alt={project.fileName}
                className="image"
              />
              <p className="fileNameText">{project.fileName}</p>
            </div>
          ))}
      </div>
      */}
      {/* Display user's uploaded images */}
      {userImages.length > 0 && (
        <div>
          <p>Welcome, {user.uid}!</p>

          {/* Display user's uploaded images */}
          <h2>Your Recent Projects</h2>
          {userImages.map((image) => (
            <div key={image.imageName}>
              <p>Image Name: {image.imageName}</p>
              {/* Decode the URL-encoded image name */}
              <img
                src={decodeURIComponent(image.imageUrl)}
                alt={image.imageName}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MainContent;
