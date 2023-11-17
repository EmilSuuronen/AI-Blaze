import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CreateNewProject_Styles.css';
import { UserAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';

export default function CreateNewProject() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const {user} = UserAuth();
    const wireframeCollectionRef = collection(db, "wireframe");
    const [docId, setDocId] = useState(null);
    const navigate = useNavigate();
    
    // navigate to labeling view with docId
    const handleNavigate = () => {
        navigate("/labelEditor", {
            state: {
                id: docId
            }
        })
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Function to handle image saving to firestore
    const handleFileUpload = async () => {
        if (selectedFile == null)  {
            return;
        } else {
            const imageObject = {
                file: selectedFile,
                dataUrl: URL.createObjectURL(selectedFile)
            }

            try {
                const docRef = await addDoc(wireframeCollectionRef, {imageUrl: imageObject.dataUrl, imageName: imageObject.file.name, uid: user.uid})
                setDocId(docRef.id);
                console.log("File saved to firestore", docRef.id)
            } catch (error) {
                console.error("Failed to upload file:", error)
            }
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
                </div>
            )}
            {docId && (
                <div>
                    <Link 
                        to="/labelEditor"
                        state={{
                            id: docId
                        }}
                        onClick={handleNavigate}
                        >
                        <button>Label your own data</button>
                    </Link>
                    {/* <Link 
                        // to={{
                        //     pathname: "/generate",
                        //     state: {docId: docId}
                        // }}
                        // to="/generate" 
                        // onClick={handleNavigate}
                        >
                        <button>Auto generate from image</button>
                    </Link> */}
                </div>

            )}
            
        </div>
    );
}