import React, { useState } from "react";
import "./ProjectCard.css";

function ProjectCard({ projectName, contentData, notes, onNoteChange }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveNote = () => {
    // Save the notes to local storage
    localStorage.setItem(projectName, notes);
    setIsEditing(false); // Exit "edit" mode after saving
  };

  return (
    <div className="projectCard">
      <p className="projectName">{projectName}</p>
      <iframe
        title={projectName}
        srcDoc={contentData}
        className="iframeRecentProject"
      />
      {isEditing ? (
        <div>
          <textarea
            placeholder="Enter notes here..."
            value={notes || ""}
            onChange={onNoteChange}
            className="notesTextArea"
          />
          <button onClick={handleSaveNote}>Save</button>
        </div>
      ) : (
        <div>
          <p>{notes}</p>
          <button onClick={() => setIsEditing(true)}>Edit Notes</button>
        </div>
      )}
    </div>
  );
}

export default ProjectCard;
