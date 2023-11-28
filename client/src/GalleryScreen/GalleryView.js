import React, { useEffect, useState } from "react";
import "./GalleryView.css";
import HeaderBar from "../components/Header/HeaderBar";
import { UserAuth } from "../context/AuthContext";
import fetchImagesByUser from "../script/FetchImagesByUser";

function GalleryView() {
  const { user } = UserAuth();
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
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

  return (
    <div>
      <HeaderBar />
      <div className="galleryContainer">
        {allProjects.map((project, index) => (
          <div key={index} className="galleryItem">
            <p>{project.imageName}</p>
            <iframe
              title={`Project ${index}`}
              srcDoc={project.contentData}
              className="galleryProject"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalleryView;
