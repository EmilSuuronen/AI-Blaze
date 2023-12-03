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

  const openCreateNewProjectModal = () => {
    setCreateNewProjectModalOpen(true);
  };

  const closeCreateNewProjectModal = () => {
    setCreateNewProjectModalOpen(false);
  };

  return (
    <div className="info_container">
      {user && (
        <p>
          Welcome, {user.email} , id (dev purposes): {user.uid}!
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
