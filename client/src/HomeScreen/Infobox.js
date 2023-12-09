import React, { useEffect, useState } from "react";
import "./InfoBox.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import {Link, useNavigate} from "react-router-dom";
import Modal from "@mui/material/Modal";
import CreateNewProject from "../CreateNewProject/CreateNewProject";

function InformationBox({ infoText }) {
  const [user, setUser] = useState(null);
  const [isCreateNewProjectModalOpen, setCreateNewProjectModalOpen] =
      useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Function to extract the part of the email before "@"
  const getEmailPrefix = (email) => {
    if (email) {
      const parts = email.split("@")
      if (parts.length === 2) {
        return parts[0]; // Get the part before "@"
      }
    }
    return "";
  };

  const navigate = useNavigate();
  const handleNavigateToGenerateView = () => {
    navigate({
      pathname: "/galleryView",
    });
  }

  const openCreateNewProjectModal = () => {
    setCreateNewProjectModalOpen(true);
  };

  const closeCreateNewProjectModal = () => {
    setCreateNewProjectModalOpen(false);
  };

  return (
      <div className="info_container">
        <div className="info-container-content">

          {user && (
              <div className="paragraph-text">
                Welcome{" "}
                <p className="text-welcome-name" id="text-welcome-name-small">{getEmailPrefix(user.email)} </p>
              </div>
          )}
          <div className="separator"/>
          <div className="div-info-button-container">
              <div className="div-info-box-button" onClick={openCreateNewProjectModal}>
                <div className="div-info-box-button-title">Create project</div>
              </div>
            <div className="div-info-box-button" onClick={handleNavigateToGenerateView}>
              <div className="div-info-box-button-title">Gallery</div>
            </div>
          </div>
        </div>
        <Modal
            open={isCreateNewProjectModalOpen}
            onClose={closeCreateNewProjectModal}
        >
          <div className="modal-content">
            <CreateNewProject />
          </div>
        </Modal>
      </div>
  );
}

export default InformationBox;
