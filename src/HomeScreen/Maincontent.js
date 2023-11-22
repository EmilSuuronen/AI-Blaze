// MainContent.js
import React from "react";
import "./MainContent.css";

function MainContent({ imageUrls }) {
  return (
    <div>
      <h3 className="recentProjectsText">Your Recent Projects</h3>
      <div className="recentsContainer">
        {imageUrls.map((url, index) => (
          <div>
            <p>{url.imageName}</p>
            <img
              key={index}
              src={url.imageUrl}
              alt={`${index}`}
              style={{ width: "200px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainContent;
