import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CreateNewProject_Styles.css';
import ImageUploader from 'react-image-upload'
import {TiDelete} from "react-icons/ti";
import {BsFillCameraFill} from "react-icons/bs";
import {IconContext} from "react-icons";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HeaderBar from "../components/Header/HeaderBar";
import Box from '@mui/material/Box';

const PlaceholderImage = require('./placeholder.png');

export default function CreateNewProject() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

        // delete image by delete icon
    function runAfterImageDelete(file) {
        console.log({ file })
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
        <div>
            <HeaderBar />
            <Box className="container">
                <Box className="imageContainer">
                    {selectedFile ? (
                        <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <img
                        src={PlaceholderImage}
                        alt="Placeholder"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                )}
                </Box>
                
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="image-upload"
                />
                <label htmlFor="image-upload">
                    <Button component="span" variant="contained" color="primary" sx={{ marginTop: '10px' }}>
                    Upload Image
                    </Button>
                </label>
                <Link to="/labelEditor">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleNavigate('/labelEditor')}
                        sx={{ marginTop: '10px' }}
                    >
                        Label your image
                     </Button>
                </Link>
                <Link to="/generate">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleNavigate('/generate')}
                        sx={{ marginTop: '10px' }}
                    >
                        Generate from image
                    </Button>
                </Link>
            </Box>
        
        </div>
            //  <ImageUploader
        //         style={{
        //             height: 500, 
        //             width: 400, 
        //             borderRadius: 20,
        //             margin: 10,
        //         }}
        //         onFileAdded={(img) => handleFileSelect(img)}
        //         onFileRemoved={(img) => runAfterImageDelete(img)}
        //         deleteIcon={
        //             <IconContext.Provider value={{size: 30}}>
        //                 <div>
        //                     <TiDelete />
        //                 </div>
        //             </IconContext.Provider>
        //         }
        //         uploadIcon={
        //             <IconContext.Provider value={{size: 50}}>
        //                 <div>
        //                 <BsFillCameraFill />
        //                 </div>
        //             </IconContext.Provider>
        //         }
        //     />
        //     <div className="button_container">
        //         <Typography variant="h6" component="h2" className="text_container">
        //             Press here to upload your wireframe
        //         </Typography>
        //         <input type="file" accept="image/*" onChange={handleFileSelect} />
        //         <Button onClick={handleFileUpload}>Upload</Button>
        //         {/* <Button variant="contained" onClick={handleFileSelect}>
        //             Upload Image
        //         </Button>
        //         <input type="file" accept="image/*" style={{ display: 'none' }} />
        //         <Button 
        //             variant="contained"
        //             onClick={handleFileUpload}>
        //             Upload
        //         </Button> */}
        //         <Typography variant="h6" component="h2" className="text_container">
        //             Press here to generate UI
        //         </Typography>
        //         <Button 
        //             variant="contained"
        //             onClick={() => console.log('creating the app')}>
        //             Create the App
        //         </Button>
        //     </div>
        // </div>
        // <div
        //     style={{
        //         display: "flex",
        //         flexDirection: "column",
        //         alignItems: "center",
        //         justifyContent: "center",
        //         margin: "auto"
        //     }}
        // >
        //     <h1> Create a new project</h1>
        //     <input type="file" accept="image/*" onChange={handleFileSelect} />
        //     <button onClick={handleFileUpload}>Upload</button>
        //     {imagePreview && (
        //         <div>
        //             <h2>Preview</h2>
        //             <img src={imagePreview} alt="Selected" className="file-preview-img" />
        //             <Link to="/labelEditor" onClick={handleNavigate}>
        //                 <button>Label your own data</button>
        //             </Link>
        //             <Link to="/generate" onClick={handleNavigate}>
        //                 <button>Auto generate from image</button>
        //             </Link>
        //         </div>
        //     )}
        // </div>
    );
}