import React from "react";
import "./InfoBox.css";

function InformationBox({ infoText }) {
  return (
    <div className="container">
      <p className="infoText">{infoText}</p>
      <div className="separator" />
    </div>
  );
}

export default InformationBox;
