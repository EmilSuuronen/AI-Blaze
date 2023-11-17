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
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto"
            }}
        >
            <HeaderBar/>
            <h1> Create a new project</h1>
            <input type="file" accept="image/*" onChange={handleFileSelect}/>
            <button onClick={handleFileUpload}>Upload</button>
            {imagePreview && (
                <div>
                    <h2>Preview</h2>
                    <img src={imagePreview} alt="Selected" className="file-preview-img"/>
                </div>
            )}
            {docId && (
                <div>
                    <Link
                        to="/labelEditor"
                        state={{
                            id: docId
                        }}
                        onClick={handleNavigateToLabelEditor}
                    >
                        <button>Label your own data</button>
                    </Link>
                    <Link
                        to="/generate"
                        state={{
                            id: docId
                        }}
                        onClick={handleNavigateToGenerateView}
                    >
                        <button>Auto generate from image</button>
                    </Link>
                </div>
            )}
        </div>
    );
}