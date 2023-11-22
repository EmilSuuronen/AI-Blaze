// MainContent.js
import React from "react";
import "./MainContent.css";

function MainContent({ imageUrls }) {
  return (
    <div>
      <h3>Your Recent Projects</h3>
      {imageUrls.map((url, index) => (
        <div>
          <p>{url.imageName}</p>
          <img
            key={index}
            src={url.imageUrl}
            alt={`Image ${index}`}
            style={{ width: "100px", height: "200px" }}
          />
        </div>
      ))}
    </div>
  );
}

export default MainContent;
