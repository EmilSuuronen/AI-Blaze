import {Link} from "react-router-dom";
import {useState} from "react";
import './CreateNewProject_Styles.css';
import DrawingTools from "../script/DrawingTools";

export default function CreateNewProject() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        // Display a preview of the selected image
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Function to handle file upload
    const handleFileUpload = () => {
        // You can implement your upload logic here
        if (selectedFile) {
            // For a temporary display, you don't need to upload anywhere
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
            }}
        >
            <h1> Create a new project</h1>
            <input type="file" accept="image/*" onChange={handleFileSelect} />
            <button onClick={handleFileUpload}>Upload</button>
            {imagePreview && (
                <div>
                    <h2>Preview</h2>
                    <DrawingTools imageSrc={imagePreview}/>
                </div>
                )}
        </div>
    );
}