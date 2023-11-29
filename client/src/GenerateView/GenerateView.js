import React, {useEffect, useMemo, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./GenerateView.css";
import HeaderBar from "../components/Header/HeaderBar";
import Button from "@mui/material/Button";
import {quantum} from "ldrs";
import ColorPicker from "../components/ColorPicker/ColorPicker.js";
import fetchImageData from "../script/FetchImageData.js";
import saveProject from "../script/SaveProject";
import TextCompletionGenerator from "../components/TextCompletionGenerator/TextCompletionGenerator";
import {downloadProjectAsZip} from "../DownLoadProject.js";

export default function GenerateView() {
    // Location of the page and the data passed from the previous page
    const location = useLocation();
    const elementData = location.state?.objectData;
    const [labels, setLabels] = useState(
        elementData ? elementData.map((element) => element.label) : null
    );

    //response data from the ChatGPT API
    const [parsedResponse, setParsedResponse] = useState({});

    // Loading animation states
    const [isLoading, setIsLoading] = useState(false);
    quantum.register();

    // Navigation
    const navigate = useNavigate();

    // State variables for editing values
    const [previewBackgroundColor, setPreviewBackgroundColor] =
        useState("#cbcbcb");
    const [previewButtonColor, setPreviewButtonColor] = useState("#cbcbcb");
    const [previewDivColor, setPreviewDivColor] = useState("#cbcbcb");

    // Get the Image ID from parameters
    const docId = location.state?.id;
    // State variable to save the image data to
    const [imageData, setImageData] = useState(null);

    // set the ref for Preview element
    const iframeRef = useRef(null);

    // State variable for the width and height input value of selected element
    const [selectedElementRef, setSelectedElementRef] = useState(null);
    const [selectedElementWidth, setSelectedElementWidth] = useState('');
    const [selectedElementHeight, setSelectedElementHeight] = useState('');

    // set the user edited css and js
    const [userEditedCSS, setUserEditedCSS] = useState('');
    const [userEditedJS, setUserEditedJS] = useState('')

    // Handle the preview navigate
    const handlePreviewNavigate = () => {
        navigate("/preview", {state: {htmlContent: htmlContent}});
    };

    // Variable required for regeneration after initial generation
    const [isRegeneratedDesign, setIsRegeneratedDesign] = useState(false);

    useEffect(() => {
        if (elementData == null) {
            fetchImageData(docId).then((data) => setImageData(data));
            console.log("Image data fetched " + imageData);
            if (isRegeneratedDesign === false) {
                handleSendToChatGPTVision(imageData).then(r => console.log(r));
            }
        }
    }, [docId, imageData, isRegeneratedDesign]);


    // Get values from labeling view and map them. If no values are passed, use vision API to generate design
    useEffect(  () => {
        if (elementData != null && isRegeneratedDesign === false) {
            setLabels(elementData.map((element) => element.label));
            handleSendToChatGPT(elementData).then(r => console.log(r));
            console.log("Labels: " + labels);
        }
    }, [elementData, isRegeneratedDesign]);

    // Add an useEffect to listen for changes in parsedResponse
    useEffect(() => {
        if (parsedResponse && Object.keys(parsedResponse).length > 0) {
            setIsLoading(false);
        }
    }, [parsedResponse]);

    //Send data to ChatGPT API
    async function handleSendToChatGPT() {
        setIsLoading(true);
        try {
            const response = await fetch('/generate-with-labels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({elementData: "generate code based on these components: " + labels})
            });
            const data = await response.json();
            setParsedResponse(JSON.parse(data));
            await handleSaveProject();
            setIsRegeneratedDesign(true);
        } catch (error) {
            console.error("Failed to generate response:", error);
        }
    }

    //Send image data to chatGPT vision API
    async function handleSendToChatGPTVision() {
        console.log("Generation with vision started");
        setIsLoading(true);
        try {
            const response = await fetch('/generate-with-vision', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({imageUrl: imageData})
            });
            const data = await response.json();
            setParsedResponse(JSON.parse(data));
            await handleSaveProject();
            setIsRegeneratedDesign(true);
        } catch (error) {
            console.error("Failed to generate response:", error);
        }
    }

    async function handleRegenerate() {
        if (elementData != null) {
            handleSendToChatGPT(elementData).then(r => console.log(r));
        } else {
            handleSendToChatGPTVision(imageData).then(r => console.log(r));
        }
    }

    // useMemo hook will re-compute when parsedResponse changes
    const htmlContent = useMemo(() => {
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
    }, [
        parsedResponse.CSS,
        parsedResponse.HTML,
        previewBackgroundColor,
        previewButtonColor,
        previewDivColor,
    ]);

    // Function to handle saving the project
    const handleSaveProject = async () => {
        await saveProject(docId, getCurrentIframeContent());
    };

    // Function to handle downloading as a zip
    const handleDownloadAsZip = () => {
        // Get the project name from the location state or use a default name
        const projectName = location.state?.projectName || "default_project_name";

        if (htmlContent) {
            downloadProjectAsZip(
                projectName, // Use the project name for the zip file
                htmlContent,
                parsedResponse.CSS
            );
        }
    };

    // Function to handle selection of an element and text displays in element sizing
    const handleElementSelection = (elementRef) => {
        setSelectedElementRef(elementRef);
    };

    // Function to handle input change for width and height
    const handleInputChange = (type, value) => {
        if (type === 'width') {
            setSelectedElementWidth(value);
        } else if (type === 'height') {
            setSelectedElementHeight(value);
        }
    };

    // generate the css for element sizing
    const generateUserEditedCSS = (elementRef, width, height) => {
        if (!elementRef || (!width && !height)) return '';

        const idName = elementRef.id;
        const widthCSS = width ?
            `
            #${idName} { 
                width: ${width}px; 
            }
            ` : '';
        const heightCSS = height ?
            `
            #${idName} { 
                height: ${height}px; 
            }
            ` : '';

        const combinedCSS = widthCSS + heightCSS;

        setUserEditedCSS(prevCSS => prevCSS + combinedCSS);

        // set value to null for next element
        setSelectedElementWidth(null);
        setSelectedElementHeight(null);

    };

    // Function to set up event listener for applying size changes and delay 500 milliseconds
    useEffect(() => {
        const applyCssUpdate = setTimeout(() => {
            generateUserEditedCSS(selectedElementRef, selectedElementWidth, selectedElementHeight);
            console.log('big html:', htmlContent);
        }, 500);
        return () => clearTimeout(applyCssUpdate);

    }, [selectedElementWidth, selectedElementHeight, selectedElementRef]);

    // set up click listener and assign the className to each element
    const setupEventListeners = (elements, prefix, handler) => {
        let count = 1;
        Array.from(elements).forEach((element) => {
            element.addEventListener('click', (event) => {
                event.preventDefault();
                handler(element);
            });
            const elementId = `${prefix}-${count}`;
            element.setAttribute('id', elementId);
            count++;
        })
    }

    // Function to get the current content of the iframe
    const getCurrentIframeContent = () => {
        if (iframeRef.current) {
            const iframeDocument = iframeRef.current.contentDocument;
            if (iframeDocument) {
                return iframeDocument.documentElement.outerHTML;
            }
        }
        return '';
    };

    // handle elements to be sized and set up js to htmlContent
    const handleIframeLoad = () => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        // set up the event listener to each element
        const elementsToSize = ['button', 'input', 'img'];
        elementsToSize.forEach((elementType) => {
            const elements = iframe.contentDocument.getElementsByTagName(elementType);
            setupEventListeners(elements, elementType, handleElementSelection);
        })

        const js = `
            const addNumberedIds = (elements, className) => {
                let count = 1;
                Array.from(elements).forEach((element) => {
                    const elementId = \`\${prefix}-\${count}\`;
                    element.setAttribute('id', elementId);
                    count++;
                });
            };
        
            const buttons = document.getElementsByTagName('button');
            const inputs = document.getElementsByTagName('input');
            const images = document.getElementsByTagName('image');
        
            addNumberedIds(buttons, 'button');
            addNumberedIds(inputs, 'input');
            addNumberedIds(images, 'image');
        `
        setUserEditedJS(js);
    };

    return (
        <div className="generate-view-main">
            <HeaderBar/>
            {isLoading ? (
                <div className="div-loader">
                    <l-quantum size="45" speed="1.75" color="#4F518C">
                        LoadingElement
                    </l-quantum>
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
                            <div
                                className="title-editor-top-bar-container"
                                id="title-editor-top-bar-container-iframe"
                            >
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
                                    <div>
                                        Background color
                                        <ColorPicker
                                            color={previewBackgroundColor}
                                            onColorChange={setPreviewBackgroundColor}
                                        />
                                    </div>
                                    <div>
                                        Button color
                                        <ColorPicker
                                            color={previewButtonColor}
                                            onColorChange={setPreviewButtonColor}
                                        />
                                    </div>
                                    <div>
                                        Div colors
                                        <ColorPicker
                                            color={previewDivColor}
                                            onColorChange={setPreviewDivColor}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="div-editor-options">
                                <div className="title-editor-top-bar-container">
                                    Element sizing
                                </div>
                            </div>
                            <div className="div-editor-options">
                                <div className="title-editor-top-bar-container">
                                    Text Completion
                                </div>
                                {Object.keys(parsedResponse).length > 0 && (
                                    <TextCompletionGenerator iframeRef={iframeRef}/>
                                )}
                            </div>
                            <div className="div-editor-options">
                                <div className="title-editor-top-bar-container">
                                    Save and regenerate
                                </div>
                                <div className="div-editor-options-content-container">
                                    <Button
                                        id="button-generate"
                                        variant="outlined"
                                        onClick={handleRegenerate}
                                    > Regenerate </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={handlePreviewNavigate}
                                    >
                                        Preview
                                    </Button>
                                    <Button
                                        id="button-generate"
                                        variant="outlined"
                                        onClick={handlePreviewNavigate}
                                    >
                                        Preview
                                    </Button>
                                    <Button
                                        id="button-generate"
                                        variant="contained"
                                        onClick={handleSaveProject}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                            {/* Download as Zip button */}
                            <div className="div-editor-options">
                                <div className="title-editor-top-bar-container">
                                    Download as Zip
                                </div>
                                <div className="div-editor-options-content-container">
                                    <Button
                                        id="button-download-zip"
                                        variant="contained"
                                        onClick={handleDownloadAsZip}
                                    >
                                        Download as Zip
                                    </Button>
                                </div>
                            </div>
                            {/* End Download as Zip button */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}