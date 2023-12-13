import React, { useState, useEffect } from "react";
import "./ProjectCard.css";
import { db } from "../firebaseConfig";
import saveNotes from "../script/SaveNotes"; // Import the saveNotes function

function ProjectCard({
  projectName,
  contentData,
  notes,
  onNoteChange,
  lastUpdated,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [projectNotes, setProjectNotes] = useState(notes);

  const handleSaveNote = async () => {
    try {
      await saveNotes(projectName, projectNotes);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  return (
    <div className="projectCard">
      <div className="project-card-top-div">
        <p className="text-project-name">{projectName}</p>
        <i className="text-project-date">Edited: {lastUpdated}</i>
      </div>
        <iframe
            srcDoc={contentData}
            className="galleryProject"
            frameBorder="0"
            scrolling="no"
        />
    </div>
  );
}

export default ProjectCard;
