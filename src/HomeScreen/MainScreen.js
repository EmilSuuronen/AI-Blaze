import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import InformationBox from "./Infobox";
import MainContent from "./Maincontent";
import fetchImagesByUser from "../script/FetchImagesByUser";
import fetchImageData from "../script/FetchImageData";
import * as PropTypes from "prop-types";
import {UserAuth} from "../context/AuthContext";

function ImageComponent(props) {
  return null;
}

ImageComponent.propTypes = {imageUrl: PropTypes.string};

function MainScreen() {
  const { user} = UserAuth();
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (user && user.uid) {
      const uid = user.uid;

      // Fetch images from firestore by the current logged-in user ID
      const imagesArrayByUser = fetchImagesByUser(uid);
      console.log("imagesArrayByUser: ", imagesArrayByUser);

      // Parse the array of image urls and set them to the state variable
      imagesArrayByUser
        .then((urls) => {
          setImageUrls(urls);
        })
        .catch((error) => {
          console.error("Error fetching images: ", error);
        });
    } else {
      console.log("User logged out");
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      {user ? (
        <div>
          <InformationBox infoText="Your Information" />
          <MainContent imageUrls={imageUrls} />
        </div>
      ) : (
        <p>Please sign in to access this content.</p>
      )}
    </div>
  );
}

export default MainScreen;
