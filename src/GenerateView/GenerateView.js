import {sendToChatGPT} from "../Api/ChatGPT-api";
import React, {useEffect, useMemo, useState, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./GenerateView.css";
import {sendToChatGPTVision} from "../Api/ChatGPT-vision-api";
import HeaderBar from "../components/Header/HeaderBar";
import Button from "@mui/material/Button";
import {quantum} from "ldrs";
import ColorPicker from '../components/ColorPicker/ColorPicker.js';
import fetchImageData from '../script/FetchImageData.js';
import saveProject from "../script/SaveProject";

export default function GenerateView() {

    //location of the page and the data passed from the previous page
    const location = useLocation();
    const elementData = location.state?.objectData;
    const [labels, setLabels] = useState(elementData ? elementData.map(element => element.label) : null);

    //response data from the ChatGPT API
    const [responseData, setResponseData] = useState('no data yet');
    const [parsedResponse, setParsedResponse] = useState({});

    //Loading animation states
    const [isLoading, setIsLoading] = useState(false);
    quantum.register()

    //Navigation
    const navigate = useNavigate();

    //State variables for editing values
    const [previewBackgroundColor, setPreviewBackgroundColor] = useState('#cbcbcb');
    const [previewButtonColor, setPreviewButtonColor] = useState('#cbcbcb');
    const [previewDivColor, setPreviewDivColor] = useState('#cbcbcb');

    // get the Image ID from parameters
    const docId = location.state?.id;
    // State variable to save the image data to
    const [imageData, setImageData] = useState(null);

    // set the ref for Preview element 
    const iframeRef = useRef(null);

    // handle the preview navigate
    const handlePreviewNavigate = () => {
        navigate('/preview', { state: { htmlContent: htmlContent}})
    }

    useEffect(() => {
        if (docId) {
            fetchImageData(docId).then(data => setImageData(data));
            console.log("Image data fetched " + imageData);
        }
    }, [docId, imageData]);

    //Get values from labeling view and map them. If no values are passed, use vision API to generate design
    useEffect(() => {
        if (elementData != null) {
            setLabels(elementData.map(element => element.label));
            console.log("labelsdata: " + labels)
            handleSendToChatGPT(elementData);
        } else {
            handleSendToChatGPTVision(imageData);
        }
    }, [elementData, imageData,]);

    const handleNavigate = () => {
        navigate("/createNewProject");
    };

    //Send data to ChatGPT API
    const handleSendToChatGPT = async () => {
        console.log("Generation started");
        setIsLoading(true);
        try {
            const response = await sendToChatGPT("generate code based on these components: " + labels);
            const data = await response;
            setResponseData(data);
            setParsedResponse(JSON.parse(data));
        } catch (error) {
            console.error("Failed to generate response:", error);
        } finally {
            setIsLoading(false);
        }
    };

    //Send image data to chatGPT vision API
    const handleSendToChatGPTVision = async () => {
        console.log("Generation with vision started");
        setIsLoading(true);
        try {
            const response = await sendToChatGPTVision(imageData);
            const data = await response;
            setResponseData(data);
            setParsedResponse(JSON.parse(data));
        } catch (error) {
            console.error("Failed to generate response:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // useMemo hook will re-compute when parsedResponse changes
    const htmlContent = useMemo(() => {
        // If parsedResponse is not yet populated, return null or some fallback content
        /*if (isLoading || !parsedResponse.HTML || !parsedResponse.CSS) {
            return null;
        }*/
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
        body {
            display: flex;
            align-content: center;
            justify-content: space-evenly;
            flex-direction: column;
            background-color: ${previewBackgroundColor};
            padding: 8px;
        }
        button{
        background-color: ${previewButtonColor};
        }
        div{
        background-color: ${previewDivColor};
        }
        ${parsedResponse.CSS}
        </style>
      </head>
      <body>
        ${parsedResponse.HTML}
      </body>
      </html>
    `;
    }, [parsedResponse.CSS, parsedResponse.HTML, previewBackgroundColor, previewButtonColor, previewDivColor]);

    const handleSaveProject = async() => {
        console.log("Saving project: " + htmlContent);
        await saveProject(docId, htmlContent);
        console.log("Project saved");
    }

    // State variable for the width and height input value of selected element
    const [selectedElementRef, setSelectedElementRef] = useState(null);
    const [selectedElementWidth, setSelectedElementWidth] = useState('');
    const [selectedElementHeight, setSelectedElementHeight] = useState('');

    // Function to handle width input change
    const handleWidthInputChange = (event) => {
        setSelectedElementWidth(event.target.value);
    };

    // Function to handle height input change
    const handleHeightInputChange = (event) => {
        setSelectedElementHeight(event.target.value);
    };

    // Function to handle selection of an element and text displays in element sizing
    const handleElementSelection = (elementRef) => {
        setSelectedElementRef(elementRef);
    };

    // Function to apply the width to the selected element
    const applyWidthToElement = () => {
        if (!selectedElementRef || !selectedElementWidth) return;

        selectedElementRef.style.width = selectedElementWidth + 'px';

        // set the width to null for next selected element
        setSelectedElementWidth(null);
    };

    // Function to apply the width to the selected element
    const applyHeightToElement = () => {
        if (!selectedElementRef || !selectedElementHeight) return;
    
        selectedElementRef.style.height = selectedElementHeight + 'px';

        // set the height to null for next selected element
        setSelectedElementHeight(null);
    };

    // Function to set up event listener for applying size changes
    useEffect(() => {
        const applySizeChanges = setTimeout(() => {
            applyWidthToElement();
            applyHeightToElement();
        }, 500); // Adjust this debounce time as needed

        return () => clearTimeout(applySizeChanges);
    }, [selectedElementWidth, selectedElementHeight, selectedElementRef]);

    const handleIframeLoad = () => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const buttons = iframe.contentDocument.getElementsByTagName('button');
        Array.from(buttons).forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                handleElementSelection(button);
            });

        });

        const inputs = iframe.contentDocument.getElementsByTagName('input');
        Array.from(inputs).forEach((input) => {
             // Adding a click event to select an element
            input.addEventListener('click', () => {
                handleElementSelection(input);
            });
        });

        const images = iframe.contentDocument.getElementsByTagName('img');
        Array.from(images).forEach((image) => {
             // Adding a click event to select an element
            image.addEventListener('click', () => {
                handleElementSelection(image);
            });
        });

        const pictures = iframe.contentDocument.getElementsByTagName('picture');
        Array.from(pictures).forEach((picture) => {
             // Adding a click event to select an element
            picture.addEventListener('click', () => {
                handleElementSelection(picture);
            });
        });
    };

    return (
        <div className="generate-view-main">
            <HeaderBar/>
            {isLoading ? (
                <div className="div-loader">
                    <l-quantum
                        size="45"
                        speed="1.75"
                        color="#4F518C"
                    >LoadingElement</l-quantum>
                    <h3 className="h3-loading-title">Generating your website...</h3>
                </div>
            ) : (
                <div className="div-generation-editor">
                    <div className="div-editor-info-text">
                        <h2>Edit and save</h2>
                        <p> Here you can edit, save or regenerate your design.</p>
                    </div>
                    <div className="div-editor-row">
                        <div className="div-preview-iframe-container">
                            <div className="title-editor-top-bar-container" id="title-editor-top-bar-container-iframe">
                                Preview
                            </div>
                            <iframe
                                id="iframe-code-preview"
                                srcDoc={htmlContent || 'about:blank'} // Use htmlContent or 'about:blank' if htmlContent is null
                                frameBorder="0"
                                sandbox="allow-scripts allow-same-origin allow-forms"
                                ref={iframeRef}
                                onLoad={handleIframeLoad}
                            >Iframe</iframe>
                        </div>
                        <div className="div-editor-flex-column">
                            <div className="div-editor-options">
                                <div className="title-editor-top-bar-container">
                                    Edit Colors
                                </div>
                                <div className="div-editor-options-content-container">
                                    <div>Background color
                                        <ColorPicker color={previewBackgroundColor} onColorChange={setPreviewBackgroundColor}/>
                                    </div>
                                    <div>Button color
                                        <ColorPicker color={previewButtonColor} onColorChange={setPreviewButtonColor}/>
                                    </div>
                                    <div>Div colors
                                        <ColorPicker color={previewDivColor} onColorChange={setPreviewDivColor}/>
                                    </div>
                                </div>
                            </div>
                            <div className="div-editor-options">
                                <div className="title-editor-top-bar-container">
                                    Element sizing
                                </div>
                                <div className="div-editor-element-sizing-content-container">
                                    <div 
                                        className="div-editor-element-sizing-content">
                                        You are selecting: {selectedElementRef ? selectedElementRef.tagName : 'None'}
                                    </div>
                                    <div 
                                        className="div-editor-element-sizing-content">
                                            Width input:
                                        <input
                                            className="div-editor-element-sizing-input"
                                            type="number"
                                            value={selectedElementWidth}
                                            onChange={handleWidthInputChange}
                                            placeholder="Enter width"
                                        />
                                        px
                                    </div>
                                    <div
                                        className="div-editor-element-sizing-content">
                                            Height input:
                                        <input
                                            className="div-editor-element-sizing-input"
                                            type="number"
                                            value={selectedElementHeight}
                                            onChange={handleHeightInputChange}
                                            placeholder="Enter height"
                                        />
                                        px
                                    </div>
                                </div>
                            </div>
                            <div className="div-editor-options">
                                <div className="title-editor-top-bar-container">
                                    Text content
                                </div>
                            </div>
                            <div className="div-editor-options">
                                <div className="title-editor-top-bar-container">
                                    Save and regenerate
                                </div>
                                <div className="div-editor-options-content-container">
                                    <Button id="button-generate" variant="outlined" onClick={handleSendToChatGPTVision}>
                                        Regenerate
                                    </Button>
                                    <Button 
                                        id="button-generate" 
                                        variant="outlined" 
                                        onClick={handlePreviewNavigate}
                                    >
                                        Preview
                                    </Button>
                                    <Button id="button-generate" variant="contained" onClick={handleSaveProject}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}