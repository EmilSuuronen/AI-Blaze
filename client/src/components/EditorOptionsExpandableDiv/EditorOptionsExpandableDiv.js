// ExpandableDiv.js
import React, { useState } from 'react';
import './EditorOptionsExpandableDiv.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const EditorOptionsExpandableDiv = ({ title, content }) => {
    const [isContentVisible, setIsContentVisible] = useState(false);

    const handleToggleContent = () => {
        setIsContentVisible(!isContentVisible);
    };

    return (
        <div className="div-editor-options">
            <div className="title-editor-top-bar-container" id="editor-option-title">
                {title}
            </div>
            <div className={`div-editor-options-content-container ${isContentVisible ? 'editorOptionVisible' : 'editorOptionHidden'}`}>
                {/* Content to be hidden/shown */}
                <div className={`content ${isContentVisible ? 'editorOptionVisible' : 'editorOptionHidden'}`}>
                    {content}
                </div>
            </div>
            <div className="div-toggle-button-container">
                <i>{isContentVisible ? 'Show Less' : 'Show More'}</i>
                <button onClick={handleToggleContent} className="button-editor-show-more">
                    {isContentVisible ? <FaChevronUp/> : <FaChevronDown />}
                </button>
            </div>
        </div>
    );
};

export default EditorOptionsExpandableDiv;