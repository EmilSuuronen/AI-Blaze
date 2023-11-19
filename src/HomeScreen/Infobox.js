import React from "react";
import "./InfoBox.css";
import { UserAuth } from "../context/AuthContext";

function InformationBox({ infoText }) {
  const { user } = UserAuth();

  return (
    <div className="info_container">
      {user && <p>Welcome, {user.email}!</p>}
      <div className="separator" />
    </div>
  );
}

export default InformationBox;
