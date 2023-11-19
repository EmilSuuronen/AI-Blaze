import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import './CreateNewProject_Styles.css';
import {UserAuth} from '../context/AuthContext';
import {collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {db, storage} from "../firebaseConfig";
import {useNavigate} from 'react-router-dom';
import HeaderBar from "../components/Header/HeaderBar";

export default function CreateNewProject() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const {user} = UserAuth();
    const wireframeCollectionRef = collection(db, "wireframe");
    const [docId, setDocId] = useState(null);
    const navigate = useNavigate();

    // navigate to labeling view with docId
    const handleNavigateToLabelEditor = () => {
        navigate("/labelEditor", {
            state: {
                id: docId
            }
        })
    }

    // navigate to generateView view with docId
    const handleNavigateToGenerateView = () => {
        navigate("/generate", {
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
        if (selectedFile == null) {
            return;
        } else {
            const imageObject = {
                file: selectedFile,
                dataUrl: URL.createObjectURL(selectedFile)
            }

            const storageRef = ref(storage, `projectFiles/${selectedFile.name}`);

            try {
                // Upload the file to Firebase Storage
                const snapshot = await uploadBytes(storageRef, selectedFile);

                // Get the download URL
                const downloadURL = await getDownloadURL(snapshot.ref);

                const docRef = await addDoc(wireframeCollectionRef, {
                    imageUrl: downloadURL,
                    imageName: imageObject.file.name,
                    uid: user.uid
                })
                setDocId(docRef.id);
                console.log("File saved to firestore", docRef.id)
            } catch (error) {
                console.error("Failed to upload file:", error)
            }
        }
    };

    return (
    <div className="div-new-project-main">
        <HeaderBar/>
        <div className="div-new-project-form-container">
            <div>
                <p>
                    Upload an image to get started. For best results,<br/> use a high resolution image with a single wireframe drawing.
                </p>
            </div>
            <label htmlFor="fname" className="label-name-new-project">Project name</label>
            <input type="text" id="fname" name="fname" className="input-name-new-project"/>
            <div className="div-new-project-file-selector-container">
                <div className="div-new-project-select-file">
                    <label htmlFor="file-upload-new-project" className="button-new-project">
                        Select a file
                        <input type="file" accept="image/*" onChange={handleFileSelect} id="file-upload-new-project"/>
                    </label>
                    <i>Supported filetypes .png .jpg</i>
                </div>
                {imagePreview && (
                    <div>
                        <img src={imagePreview} alt="Selected" className="file-preview-img"/>
                    </div>
                )}
            </div>
            <button onClick={handleFileUpload} className="button-new-project" id="button-new-project-upload">Upload</button>
            {docId && (
                <div className="div-new-project-generate-buttons">
                    <label htmlFor="button-new-project-label">
                        Generate a new design by labeling the elements
                    </label>
                    <Link
                        to="/labelEditor"
                        state={{
                            id: docId
                        }}
                        onClick={handleNavigateToLabelEditor}
                    >
                        <button className="button-new-project">Label</button>
                    </Link>
                    <label htmlFor="button-new-project-label">
                        Auto-generate
                    </label>
                    <Link
                        to="/generate"
                        state={{
                            id: docId
                        }}
                        onClick={handleNavigateToGenerateView}
                    >
                        <button className="button-new-project" id="button-new-project-label">Auto generate</button>
                    </Link>
                </div>
            )}
        </div>
        </div>
    );
}