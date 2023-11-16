import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CreateNewProject_Styles.css';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../firebaseConfig';

export default function CreateNewProject() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const uid = user.uid;
            console.log("uid", uid);
          } 
        });
      }, [])

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleNavigate = () => {
        // Store the image data in localStorage before navigating
        localStorage.setItem('imageSrc', imagePreview);
    };

    // Function to handle file upload
    const handleFileUpload = () => {
        if (selectedFile) {
            alert('File uploaded temporarily');
        } else {
            alert('Please select a file to upload');
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto"
            }}
        >
            <h1> Create a new project</h1>
            <input type="file" accept="image/*" onChange={handleFileSelect} />
            <button onClick={handleFileUpload}>Upload</button>
            {imagePreview && (
                <div>
                    <h2>Preview</h2>
                    <img src={imagePreview} alt="Selected" className="file-preview-img" />
                    <Link to="/labelEditor" onClick={handleNavigate}>
                        <button>Label your own data</button>
                    </Link>
                    <Link to="/generate" onClick={handleNavigate}>
                        <button>Auto generate from image</button>
                    </Link>
                </div>
            )}
        </div>
    );
}