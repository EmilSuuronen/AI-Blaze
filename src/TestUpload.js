import React, { useState } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebaseConfig";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { styled } from "@mui/system";

const StyledInput = styled("input")({
  display: "none",
});

const ImageUploaderContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
});

const ImagePreviewContainer = styled("div")({
  width: "500px",
  height: "400px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
  margin: "10px 0",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  alignItems: "center",
  justifyContent: "center",
});

const ImagePreview = styled("img")({
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
});

const ButtonContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  margin: "10px",
});

const UploadButton = styled(Button)({
  background: "#1976D2",
  color: "#fff",
  "&:hover": {
    background: "#1565C0",
  },
});

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const uploadFile = async () => {
    if (selectedFile == null) return;
    const filesFolderRef = ref(storage, `projectFiles/${selectedFile.name}`);
    try {
      await uploadBytes(filesFolderRef, selectedFile);
      console.log("File uploaded successfully:", selectedFile.name);
      window.alert("File uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
  };

  return (
    <ImageUploaderContainer>
      <div>
        <StyledInput
          accept="image/*"
          id="image-input"
          type="file"
          onChange={handleFileSelect}
        />
        {imagePreview && (
          <ImagePreviewContainer>
            <ImagePreview src={imagePreview} alt="Preview" />
          </ImagePreviewContainer>
        )}
        <ButtonContainer>
          <label htmlFor="image-input">
            <UploadButton variant="contained" component="span">
              Select Image
            </UploadButton>
          </label>
          <UploadButton
            variant="contained"
            onClick={uploadFile}
            disabled={!selectedFile}
          >
            Upload Image
          </UploadButton>
        </ButtonContainer>
      </div>
    </ImageUploaderContainer>
  );
}

export default ImageUploader;
