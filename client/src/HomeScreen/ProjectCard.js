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
      <p className="projectName">{projectName}</p>
      <i className="projectDate">Edited: {lastUpdated}</i>
      <iframe
        srcDoc={contentData}
        className="galleryProject"
        frameBorder="0"
        scrolling="no"
      />
      {isEditing ? (
        <div>
          <textarea
            placeholder="Enter notes here..."
            value={projectNotes || ""}
            onChange={(e) => setProjectNotes(e.target.value)}
            className="notesTextArea"
          />
          <button onClick={handleSaveNote}>Save</button>
        </div>
      ) : (
        <div>
          <p>{projectNotes}</p>
          <button onClick={() => setIsEditing(true)}>Edit Notes</button>
        </div>
      )}
    </div>
  );
}

export default ProjectCard;
