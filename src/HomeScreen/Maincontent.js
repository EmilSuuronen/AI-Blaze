// MainContent.js
import React from "react";
import "./MainContent.css";

function MainContent({ imageUrls }) {
  const latestProjects = imageUrls.slice(0, 3);

  return (
    <div>
      <h3 className="recentProjectsText">Your Recent Projects</h3>
      <div className="recentsContainer">
        {latestProjects.map((url, index) => (
          <div key={index} className="projectContainer">
            <p>{url.imageName}</p>
            <div className="iframeContainer">
              <iframe
                title={`Project ${index}`}
                srcDoc={url.contentData}
                className="recentProject"
              />
            </div>
            {/*}
            <img
              key={index}
              src={url.imageUrl}
              alt={`${index}`}
              style={{ width: "100px", height: "200px" }}
        /> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainContent;
