import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import InformationBox from "./Infobox";
import MainContent from "./Maincontent";
import { UserAuth } from "../context/AuthContext";
import fetchImageData from "../script/FetchImageData";

function MainScreen({ recentProjects }) {
  const { user } = UserAuth();
  const [userImages, setUserImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.uid) {

        // Fetch user's images from Firestore
        const imageData = await fetchImageData(user.uid);

        // Use a set to keep track of unique image names
        const uniqueImageNames = new Set();

        // Filter out images with the same name
        const filteredImages = imageData.filter((image) => {
          if (!uniqueImageNames.has(image.imageName)) {
            uniqueImageNames.add(image.imageName);
            return true;
          }
          return false;
        });

        // Update state with the filtered images
        setUserImages(filteredImages);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div>
      <Navbar />
      {user ? (
        <div>
          <InformationBox infoText="Your Information" />
          <MainContent recentProjects={recentProjects} userImages={userImages} />
        </div>
      ) : (
        <p>Please sign in to access this content.</p>
      )}
    </div>
  );
}

export default MainScreen;
