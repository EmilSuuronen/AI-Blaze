import "./NewProject.css";
import "react-image-upload/dist/index.css";
import React from "react";
import ImageUploader from "react-image-upload";
import { TiDelete } from "react-icons/ti";
import { BsFillCameraFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import HeaderBar from "../components/Header/HeaderBar";
import { storage } from "../firebaseConfig";
import { useState } from "react";
import { ref, uploadBytes } from "firebase/storage";

function NewProject() {
  // upload image by camera icon
  function getImageFileObject(imageFile) {
    console.log({ imageFile });
  }

  // delete image by delete icon
  function runAfterImageDelete(file) {
    console.log({ file });
  }

  // upload image by upload button
  const handleUploadClick = () => {
    document.querySelector("input").click();
  };

  //File upload state
  const [fileUpload, setFileUpload] = useState(null);

  const uploadFile = async () => {
    if (fileUpload == null) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  return (
    <div className="container1">
      <HeaderBar />
      <ImageUploader
        style={{
          height: 500,
          width: 400,
          borderRadius: 20,
          margin: 10,
        }}
        onFileAdded={(img) => getImageFileObject(img)}
        onFileRemoved={(img) => runAfterImageDelete(img)}
        deleteIcon={
          <IconContext.Provider value={{ size: 30 }}>
            <div>
              <TiDelete />
            </div>
          </IconContext.Provider>
        }
        uploadIcon={
          <IconContext.Provider value={{ size: 50 }}>
            <div>
              <BsFillCameraFill />
            </div>
          </IconContext.Provider>
        }
      />
      <div className="button_container">
        <Typography variant="h6" component="h2" className="text_container">
          Press here to upload your wireframe
        </Typography>
        <Button variant="contained" onClick={handleUploadClick}>
          Upload Image
        </Button>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => setFileUpload(e.target.files[0])}
        />
        <Typography variant="h6" component="h2" className="text_container">
          Press here to generate UI
        </Typography>
        <Button onClick={uploadFile} variant="contained">
          Create the App
        </Button>
      </div>
    </div>
  );
}

export default NewProject;
