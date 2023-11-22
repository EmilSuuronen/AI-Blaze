// MainContent.js

import React from "react";
import "./MainContent.css";

function MainContent({ imageUrls }) {
  return (
    <div>
      <h3>Your Recent Projects</h3>
      {imageUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Image ${index}`}
          style={{ width: "100px", height: "200px" }}
        />
      ))}
    </div>
  );
}

export default MainContent;
