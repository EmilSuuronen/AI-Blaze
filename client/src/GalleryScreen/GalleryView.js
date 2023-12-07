import React, { useEffect, useState } from "react";
import "./GalleryView.css";
import HeaderBar from "../components/Header/HeaderBar";
import { UserAuth } from "../context/AuthContext";
import fetchImagesByUser from "../script/FetchImagesByUser";
import BackToTopButton from "../components/BackToTopButton/BackToTopButton";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import Modal from "../components/Modal/Modal";
import CreateNewProject from "../CreateNewProject/CreateNewProject";

function GalleryView() {
  const { user } = UserAuth();
  const [allProjects, setAllProjects] = useState([]);
  const [isCreateNewProjectModalOpen, setCreateNewProjectModalOpen] =
    useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (user && user.uid) {
      const uid = user.uid;

      // Fetch all images from firestore
      const allProjectsArray = fetchImagesByUser(uid);

      // Parse the array of image urls and set them to the state variable
      allProjectsArray
        .then((projects) => {
          setAllProjects(projects);
        })
        .catch((error) => {
          console.error("Error fetching projects: ", error);
        });
    } else {
      console.log("User logged out");
    }
  }, [user]);

  const openCreateNewProjectModal = () => {
    setCreateNewProjectModalOpen(true);
  };

  const closeCreateNewProjectModal = () => {
    setCreateNewProjectModalOpen(false);
  };

  return (
    <div>
      <HeaderBar />
      <div className="newProjectBox">
        <Button style={{textDecoration: 'none', color: 'white'}} onClick={openCreateNewProjectModal}>New Project</Button>
      </div>

      <div className="galleryContainer">
        {allProjects
          .slice() // Create a copy of the array
          .reverse() // Reverse the array so that the most recent project is at the top
          .map(
            (
              project,
              index // Map each project to a div
            ) => (
              <div key={index} className="galleryItem">
                <div className="projectCard">
                  <p className="projectName">{project.projectName}</p>
                  <iframe
                    title={`Project ${index}`}
                    srcDoc={project.contentData}
                    className="galleryProject"
                  />
                </div>
              </div>
            )
          )}
      </div>
      <BackToTopButton />
      <Modal
        isOpen={isCreateNewProjectModalOpen}
        closeModal={closeCreateNewProjectModal}
      >
        <CreateNewProject />
      </Modal>
    </div>
  );
}

export default GalleryView;
