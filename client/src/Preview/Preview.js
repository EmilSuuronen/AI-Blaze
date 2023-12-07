import React, { useState } from "react";
import HeaderBar from "../components/Header/HeaderBar";
import {useLocation } from "react-router-dom";
import {useRef} from "react";
import "./Preview.css";

const PreviewView = () => {
    const location = useLocation();
    const htmlContent = location.state?.htmlContent;
    const iframeRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showDimensionsSelector, setShowDimensionsSelector] = useState(false);

    const handleSelectorChange = () => {
        // Toggle the state when the selector changes
        setIsMobile(prevState => !prevState);
    };

    const handleShowDimensionsSelector = () => {
        setShowDimensionsSelector(!showDimensionsSelector);
    }

    return (
    <div className="preview-container-main">
        <HeaderBar/>
        <div className="preview-container-info">
            <h2>Preview</h2>
            <div className="div-floating-box">
                {showDimensionsSelector ? (
                    <div className="floating-box-top-bar">
                        <h4>Dimensions</h4>
                        <button className="button-dimensions" onClick={handleShowDimensionsSelector}>X</button>
                    </div>
                ) : (
                    <div>
                        <button className="button-dimensions" onClick={handleShowDimensionsSelector}>Dimensions</button>
                    </div>
                )}
                <div className={`show-dimensions-container ${showDimensionsSelector ? 'visible' : 'hidden'}`}>
                    <div className="slider-container">
                        <p>{isMobile ? 'Mobile' : 'Desktop'}</p>
                        <label className="switch">
                            <input type="checkbox" checked={isMobile} onChange={handleSelectorChange} />
                            <span className="slider round"/>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div className={`iframe-design-preview-container ${isMobile ? 'mobile-style' : 'desktop-style'}`}>
            <iframe
                className="iframe-design-preview"
                srcDoc={htmlContent} // Use htmlContent or 'about:blank' if htmlContent is null
                frameBorder="0"
                sandbox="allow-scripts allow-same-origin allow-forms"
                ref={iframeRef}
            >Iframe
            </iframe>
        </div>
    </div>
  );
};

export default PreviewView;
