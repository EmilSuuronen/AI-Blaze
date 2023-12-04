// ExpandableDiv.js
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import './EditorOptionsExpandableDiv.css';

const EditorOptionsExpandableDiv = ({ title, content }) => {
    const [isContentVisible, setIsContentVisible] = useState(false);

    const handleToggleContent = () => {
        setIsContentVisible(!isContentVisible);
    };

    return (
        <div className="div-editor-options">
            <div className="title-editor-top-bar-container">
                {title}
            </div>
            <div className={`div-editor-options-content-container ${isContentVisible ? 'editorOptionVisible' : 'editorOptionHidden'}`}>
                {/* Content to be hidden/shown */}
                <div className={`content ${isContentVisible ? 'editorOptionVisible' : 'editorOptionHidden'}`}>
                    {content}
                </div>
            </div>
            <div className="div-toggle-button-container">
                <Button variant="outlined" onClick={handleToggleContent}>
                    Toggle Content
                </Button>
            </div>
        </div>
    );
};

export default EditorOptionsExpandableDiv;