import React, { useState } from "react";
import HeaderBar from "../components/Header/HeaderBar";
import { useLocation } from "react-router-dom";

const PreviewView = () => {
    const location = useLocation();
    const htmlContent = location.state?.htmlContent;
    console.log('preview in previewView:', htmlContent)

  return (
    <div className="div-new-project-main">
        <HeaderBar/>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default PreviewView;
