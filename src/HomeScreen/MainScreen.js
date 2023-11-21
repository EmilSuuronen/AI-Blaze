import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import InformationBox from "./Infobox";
import MainContent from "./Maincontent";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import fetchImagesByUser from "../script/FetchImagesByUser";
import * as PropTypes from "prop-types";

function ImageComponent(props) {
  return null;
}

ImageComponent.propTypes = {imageUrl: PropTypes.string};

function MainScreen({ recentProjects }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const uid = authUser.uid;
        console.log("uid", uid);
        setUser(authUser);

        // Dummy user-specific data
        const dummyUserData = {
          email: authUser.email || "guest@example.com",
          someData: "Dummy data specific to the user", // change this to project name
        };

        setUserData(dummyUserData);

        // Fetch images from firestore by current logged in user ID
        const imagesArrayByUser = fetchImagesByUser(uid)
        console.log("imagesArrayByUser: ", imagesArrayByUser);

        // Parse the array of image urls and set them to state variable
        imagesArrayByUser.then(urls => {
          setImageUrls(urls);
        }).catch(error => {
          console.error("Error fetching images: ", error);
        });

      } else {
        console.log("User logged out");
        setUser(null);
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Navbar />
      {user ? (
        <div>
          <InformationBox infoText="Your Information" />
          <MainContent recentProjects={recentProjects} />
          <div>
            {imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Image ${index}`} style={{ width: '100px', height: '200px' }} />
            ))}
          </div>
          {userData && (
            <div>
              <p>Welcome, {user.uid}!</p>
              <p>Your specific data: {userData.someData}</p>
            </div>
          )}
        </div>
      ) : (
        <p>Please sign in to access this content.</p>
      )}
    </div>
  );
}

export default MainScreen;
