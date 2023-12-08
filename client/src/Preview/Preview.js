import React, { useState } from "react";
import HeaderBar from "../components/Header/HeaderBar";
import { useLocation } from "react-router-dom";

const PreviewView = () => {
  const location = useLocation();
  const htmlContent = location.state?.htmlContent;
  const [isMobileView, setIsMobileView] = useState(true);

  const toggleView = () => {
    setIsMobileView((prev) => !prev);
  };

  const iframeContainerStyle = {
    width: isMobileView ? "320px" : "80%",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    margin: "20px 20px",
    backgroundColor: "#4F518C",
  };

  const iframeStyle = {
    width: "100%",
    height: "100%",
    border: "none",
  };

  return (
    <div className="div-new-project-main">
      <HeaderBar />
      <div>
        <button onClick={toggleView}>
          {isMobileView ? "Switch to Web View" : "Switch to Mobile View"}
        </button>
      </div>
      <div style={iframeContainerStyle}>
        <iframe title="Preview Frame" srcDoc={htmlContent} style={iframeStyle} />
      </div>
    </div>
  );
};

export default PreviewView;
