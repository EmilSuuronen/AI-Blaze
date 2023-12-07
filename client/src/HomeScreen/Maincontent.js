import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import "./MainContent.css";

function MainContent({ imageUrls }) {
  const latestProjects = imageUrls.slice(0, 3);
  const [notes, setNotes] = useState({});

  const handleNoteChange = (index, event) => {
    const newNotes = { ...notes };
    newNotes[index] = event.target.value;
    setNotes(newNotes);
  };

  useEffect(() => {
    // Retrieve notes from local storage when the component mounts
    const retrievedNotes = {};
    latestProjects.forEach((url, index) => {
      const savedNote = localStorage.getItem(url.projectName);
      if (savedNote !== null) {
        retrievedNotes[index] = savedNote;
      }
    });
    setNotes(retrievedNotes);
  }, []); // Empty dependency array

  return (
    <div className="mainContent">
      <h3 className="recentProjectsText">Your Recent Projects</h3>
      <div className="recentsContainer">
        {latestProjects.map((url, index) => (
          <ProjectCard
            key={index}
            projectName={url.projectName}
            contentData={url.contentData}
            notes={notes[index] || ""}
            onNoteChange={(event) => handleNoteChange(index, event)}
          />
        ))}
      </div>
    </div>
  );
}

export default MainContent;
