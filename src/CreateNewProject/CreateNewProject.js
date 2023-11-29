import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import "./CreateNewProject_Styles.css";
import { UserAuth } from "../context/AuthContext";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/Header/HeaderBar";

// Import the saveProjectName function
import { saveProjectName } from "../script/SaveProjectName";

export default function CreateNewProject() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [projectName, setProjectName] = useState(""); // Added state for project name
  const { user } = UserAuth();
  const wireframeCollectionRef = collection(db, "wireframe");
  const [docId, setDocId] = useState(null);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false); // State variable for dark mode

  const toggleDarkMode = () => {
    // Function to toggle dark mode
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Function to save the project name
  const handleSaveProjectName = () => {
    if (docId && projectName.trim() !== "") {
      saveProjectName(docId, projectName)
        .then(() => {
          console.log("Project name saved successfully");
        })
        .catch((error) => {
          console.error("Error saving project name: ", error);
        });
    }
  };

  // navigate to labeling view with docId
  const handleNavigateToLabelEditor = () => {
    // Save the project name before navigating
    handleSaveProjectName();

    navigate("/labelEditor", {
      state: {
        id: docId,
      },
    });
  };

  // navigate to generateView view with docId and projectName
  const handleNavigateToGenerateView = () => {
    // Save the project name before navigating
    handleSaveProjectName();

    navigate("/generate", {
      state: {
        id: docId,
        projectName: projectName, // Pass the project name to GenerateView
      },
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Automatically start the file upload process when an image is selected
    handleFileUpload(file);
  };

  const handleFileUpload = async (file) => {
    if (file == null) {
      return;
    } else {
      const imageObject = {
        file: file,
        dataUrl: URL.createObjectURL(file),
      };

      const storageRef = ref(storage, `projectFiles/${file.name}`);

      try {
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        const docRef = await addDoc(wireframeCollectionRef, {
          imageUrl: downloadURL,
          imageName: imageObject.file.name,
          projectName: projectName, // Include project name in Firestore document
          uid: user.uid,
        });
        setDocId(docRef.id);
        console.log("File saved to Firestore", docRef.id);
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    }
  };

  // Function to delete the selected image
  const handleDeleteImage = async () => {
    if (docId) {
      const storageRef = ref(storage, `projectFiles/${selectedFile.name}`);
      try {
        // Delete the file from Firebase Storage
        await deleteObject(storageRef);

        // Remove the image URL and imageName from the Firestore document
        const docRef = doc(db, "wireframe", docId);
        await updateDoc(docRef, {
          imageUrl: deleteField(),
          imageName: deleteField(),
        });

        setImagePreview(null);
        setSelectedFile(null);
        console.log("File deleted successfully");
      } catch (error) {
        console.error("Failed to delete file:", error);
      }
    }
  };

  return (
    <div className={`div-new-project-main ${isDarkMode ? "dark-mode" : ""}`}>
      <HeaderBar />
      <div className="div-new-project-form-container">
        <div>
          <p>
            Upload an image to get started. For best results,
            <br /> use a high-resolution image with a single wireframe drawing.
          </p>
        </div>
        <div className="div-new-project-file-selector-container">
          {/* Dark mode toggle button */}
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

          <label htmlFor="fname" className="label-name-new-project">
            Project name
          </label>
          <input
            type="text"
            id="fname"
            name="fname"
            className="input-name-new-project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <div className="div-new-project-row">
            <div className="div-new-project-select-file">
              <label
                htmlFor="file-upload-new-project"
                className="button-new-project"
              >
                Select a file
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  id="file-upload-new-project"
                />
              </label>
              <i>Supported file types: .png .jpg</i>
            </div>
            {imagePreview && (
              <div className="image-preview-card">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="file-preview-img"
                />
                <button onClick={handleDeleteImage} className="button-delete">
                  Delete Image
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="div-new-project-generate-buttons">
          <label htmlFor="button-new-project-label">
            Generate a new design by labeling the elements
          </label>
          {/* Disable the "Label" button if projectName is empty or selectedFile is null */}
          {projectName.trim() !== "" && selectedFile && (
            <Link
              to="/labelEditor"
              state={{
                id: docId,
              }}
              onClick={handleNavigateToLabelEditor}
            >
              <button
                className="button-new-project"
                id="button-new-project-label"
              >
                Label
              </button>
            </Link>
          )}

          <label htmlFor="button-new-project-auto">Auto-generate</label>
          {/* Disable the "Auto generate" button if projectName is empty or selectedFile is null */}
          {projectName.trim() !== "" && selectedFile && (
            <Link
              to="/generate"
              state={{
                id: docId,
                projectName: projectName, // Pass the project name to GenerateView
              }}
              onClick={handleNavigateToGenerateView}
            >
              <button
                className="button-new-project"
                id="button-new-project-auto"
              >
                Auto generate
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
