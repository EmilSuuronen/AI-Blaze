import React, { useEffect, useState } from "react";
import "./GalleryView.css";
import HeaderBar from "../components/Header/HeaderBar";
import { UserAuth } from "../context/AuthContext";
import fetchImagesByUser from "../script/FetchImagesByUser";
import BackToTopButton from "../components/BackToTopButton/BackToTopButton";
import { Button } from "@mui/material";
import Modal from "../components/Modal/Modal";
import CreateNewProject from "../CreateNewProject/CreateNewProject";
import { Link, useNavigate } from "react-router-dom";
import { isContentEditable } from "@testing-library/user-event/dist/utils";

function GalleryView() {
  const { user } = UserAuth();
  const [allProjects, setAllProjects] = useState([]);
  const navigate = useNavigate();
  const [isCreateNewProjectModalOpen, setCreateNewProjectModalOpen] =
    useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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

  const handleNavigateToGenerateView = (contentData, documentId) => {
    console.log("contendata galleryview: ", contentData);
    navigate({
      pathname: "/generate",
      state: {
        contentData: contentData,
        documentId: documentId,
      },
    });
  };

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
        <button
          className="galleryNewProjectButton"
          onClick={openCreateNewProjectModal}
        >
          New Project
        </button>
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
                <Link
                  to="/generate"
                  state={{
                    contentData: project.contentData,
                    documentId: project.documentId,
                  }}
                  onClick={() =>
                    handleNavigateToGenerateView(
                      project.contentData,
                      project.documentId
                    )
                  }
                >
                  <div className="projectCard">
                    <p className="projectName">{project.projectName}</p>
                    <i className="projectDate">Edited: {project.lastUpdated}</i>
                    <iframe
                      title={`Project ${index}`}
                      srcDoc={project.contentData}
                      className="galleryProject"
                      frameBorder="0"
                      scrolling="no"
                    />
                  </div>
                </Link>
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
    const filteredProjects = allProjects
        .filter(project => project.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice()
        .reverse();

    return (
        <div>
            <HeaderBar/>
            <Link to="/createNewProject" style={{textDecoration: "none"}}>
                <div className="newProjectBox">+ New Project</div>
            </Link>
            <p className="gallery-title-text">Your projects</p>
            <div className="search-bar-gallery-container">
                <input
                    type="text"
                    placeholder="Search projects"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar-gallery"
                />
            </div>
            <div className="galleryContainer">
                {filteredProjects
                    .slice() // Create a copy of the array
                    .reverse() // Reverse the array so that the most recent project is at the top
                    .map(
                        (
                            project,
                            index, // Map each project to a div
                        ) => (
                            <div key={index} className="galleryItem">
                                <Link
                                    to="/generate"
                                    state={{contentData: project.contentData, documentId: project.documentId}}
                                    onClick={() => handleNavigateToGenerateView(project.contentData, project.documentId)}
                                >
                                    <div className="projectCard">
                                        <p className="projectName">{project.projectName}</p>
                                        <i className="projectDate">Edited: {project.lastUpdated}</i>
                                        <iframe
                                            title={`Project ${index}`}
                                            srcDoc={project.contentData}
                                            className="galleryProject"
                                            frameBorder="0"
                                            scrolling="no"
                                        />
                                    </div>
                                </Link>
                            </div>
                        )
                    )}
            </div>
            <BackToTopButton/>
        </div>
    );
}

export default GalleryView;
