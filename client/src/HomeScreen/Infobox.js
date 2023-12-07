import React, { useEffect, useState } from "react";
import "./InfoBox.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Modal from "../components/Modal/Modal";
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
      const parts = email.split("@");
      if (parts.length === 2) {
        return parts[0]; // Get the part before "@"
      }
    }
    return "";
  };

  const openCreateNewProjectModal = () => {
    setCreateNewProjectModalOpen(true);
  };

  const closeCreateNewProjectModal = () => {
    setCreateNewProjectModalOpen(false);
  };

  return (
    <div className="info_container">
      {user && (
        <p className="paragraph--text">
          Welcome, <p className="text-welcome-name">{getEmailPrefix(user.email)} </p>
        </p>
      )}
      <div className="separator" />
      <div className="infoButtonContainer">
        <Link to="/galleryView">
          <Button
            style={{
              backgroundColor: "rgba(79,81,140,1)",
              color: "#fffffa",
            }}
            className="infoBoxButton"
            size="medium"
            variant="contained"
          >
            Gallery
          </Button>
        </Link>
        <div className="separator2" />

        <Button
          onClick={openCreateNewProjectModal}
          style={{
            backgroundColor: "rgba(79,81,140,1)",
            color: "#fffffa",
          }}
          className="infoBoxButton"
          size="medium"
          variant="contained"
        >
          New Project
        </Button>
      </div>
      <Modal isOpen={isCreateNewProjectModalOpen} closeModal={closeCreateNewProjectModal}>
        <CreateNewProject />
      </Modal>
    </div>
  );
}

export default InformationBox;
