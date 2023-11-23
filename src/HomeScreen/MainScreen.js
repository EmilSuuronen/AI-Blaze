import React, { useEffect, useState } from "react";
import InformationBox from "./Infobox";
import MainContent from "./Maincontent";
import fetchImagesByUser from "../script/FetchImagesByUser";
import {UserAuth} from "../context/AuthContext";
import HeaderBar from "../components/Header/HeaderBar";

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
      <HeaderBar />
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
