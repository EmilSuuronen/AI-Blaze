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
import EditorOptionsExpandableDiv from "../components/EditorOptionsExpandableDiv/EditorOptionsExpandableDiv";
import handleElementHoverChange from "../script/handleElementHoverChange";

export default function GenerateView() {
    // Location of the page and the data passed from the previous page
    const location = useLocation();
    const elementData = location.state?.objectData ?? null;
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
    const docId = location.state?.id ?? null;
    // State variable to save the image data to
    const [imageData, setImageData] = useState(null);

    // Content data from navigation from home page or gallery view
    const contentData = location.state?.contentData ?? null;
    // Content data from navigation from preview page
    const documentId = location.state?.documentId ?? null;

    useEffect(() => {
        if (contentData) {
            // Set the parsed response to the state
            setParsedResponse(contentData);
        }
    }, [contentData, parsedResponse]);

    // set the ref for Preview element
    const iframeRef = useRef(null);

    // State variable for the width and height input value of selected element
    const [selectedElementRef, setSelectedElementRef] = useState(null);
    const [selectedElementUserWidth, setSelectedElementUserWidth] = useState(null);
    const [selectedElementUserHeight, setSelectedElementUserHeight] = useState(null);
    const [selectedElementOriginWidth, setSelectedElementOriginWidth] = useState('');
    const [selectedElementOriginHeight, setSelectedElementOriginHeight] = useState('');

    // set the user edited css and js
    const [userEditedCSS, setUserEditedCSS] = useState('');
    const [userEditedJS, setUserEditedJS] = useState('')

    // set the editing iframe
    const [editingIframe, setEditingIframe] = useState('');

    // Handle the preview navigate
    const handlePreviewNavigate = async () => {
        const currentIframeContent = await getCurrentIframeContent();
        navigate("/preview", {state: {htmlContent: currentIframeContent}});
    };

    useEffect(() => {
        if (docId != null) {

            const fetchImageDataAsync = async () => {
                await fetchImageData(docId).then((data) => setImageData(data));
            }
            fetchImageDataAsync().catch(console.error);

            handleSendToChatGPTVision(imageData).then(r => console.log(r));
        }
    }, [contentData, docId, imageData]);

    useEffect(() => {
        if (elementData != null) {
            setLabels(elementData.map((element) => element.label));
        }
    }, [elementData]);

    useEffect(() => {
        // Ensure elementData is not null and isRegeneratedDesign is false
        if (elementData != null) {
            handleSendToChatGPT(elementData).then((result) => {
                console.log(result);
            });
        }
    }, [elementData]);

    // Add an useEffect to listen for changes in parsedResponse
    useEffect(() => {
        if (parsedResponse && Object.keys(parsedResponse).length > 0) {
            setIsLoading(false);
        }
    }, [parsedResponse]);

    //Send data to ChatGPT API
    async function handleSendToChatGPT() {
        console.log("Generation with labels started");
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
        } catch (error) {
            console.error("Failed to generate response:", error);
        } finally {
            await handleSaveProject();
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
        } catch (error) {
            console.error("Failed to generate response:", error);
        } finally {
            await handleSaveProject();
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
        <link rel="preconnect" href="https://fonts.googleapis.com">
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
        ${userEditedCSS}
        </style>
        <script>
          ${userEditedJS}
        </script>
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
        userEditedCSS,
        userEditedJS
    ]);

    // the iframe will be updated if the source is contentData
    const contentDataSource = useMemo(()=> {
        return `
        ${contentData}
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
        ${userEditedCSS}
        </style>
        `
    }, [previewBackgroundColor,
        previewButtonColor,
        previewDivColor,
        userEditedCSS]);

    // Function to handle saving the project
    const handleSaveProject = async () => {
        if (documentId != null) {
            console.log("Saving project" + documentId);
            await saveProject(documentId, getCurrentIframeContent().toString());
        } else {
            console.log("docid" + docId);
            await saveProject(docId, getCurrentIframeContent());
        }
    };

    // Function to handle downloading as a zip
    const handleDownloadAsZip = () => {
        // Get the project name from the location state or use a default name
        const projectName = location.state?.projectName || "default_project_name";

        if (contentData) {
            downloadProjectAsZip(
                projectName, // Use the project name for the zip file
                contentDataSource,
                ""
            );
        } else if (htmlContent) {
            downloadProjectAsZip(
                projectName, // Use the project name for the zip file
                htmlContent,
                parsedResponse.CSS
            );
        }
    };

    useEffect(() => {
        // Set initial content for the iframe based on contentData or htmlContent
        if (!contentData) {
            setEditingIframe(htmlContent);
        } else {
            setEditingIframe(contentDataSource);
        }
    }, [contentData, htmlContent]);

    // Function to handle selection of an element and text displays in element sizing
    const handleElementSelection = (elementRef) => {
        setSelectedElementRef(elementRef);

        // Calculate width and height directly from elementRef
        const width = elementRef.offsetWidth;
        const height = elementRef.offsetHeight;

        // Update state variables
        setSelectedElementOriginWidth(width);
        setSelectedElementOriginHeight(height);

        // set value to null for next element
        setSelectedElementUserWidth(null);
        setSelectedElementUserHeight(null);
    };

    // Function to handle input change for width and height
    const handleInputChange = (type, value) => {
        const numericValue = parseInt(value);

        if (type === 'width') {
            setSelectedElementUserWidth(numericValue);
        } else if (type === 'height') {
            setSelectedElementUserHeight(numericValue);
        }
    };

    // generate the css for element sizing
    const generateUserEditedCSS = (elementRef, width, height) => {
        if (!elementRef || (!width && !height)) return '';

        const idName = elementRef.id;
        const adjustedWidth = selectedElementUserWidth !== null ? selectedElementUserWidth : selectedElementOriginWidth;
        const adjustedHeight = selectedElementUserHeight !== null ? selectedElementUserHeight : selectedElementOriginHeight;

        const widthCSS = adjustedWidth ?
            `
            #${idName} { 
                width: ${adjustedWidth}px; 
            }
            ` : '';
        const heightCSS = adjustedHeight ?
            `
            #${idName} { 
                height: ${adjustedHeight}px; 
            }
            ` : '';

        const combinedCSS = widthCSS + heightCSS;

        setUserEditedCSS(prevCSS => prevCSS + combinedCSS);
    };

    // Function to set up event listener for applying size changes and delay 500 milliseconds
    useEffect(() => {
        const applyCssUpdate = setTimeout(() => {
            generateUserEditedCSS(selectedElementRef, selectedElementUserWidth, selectedElementUserHeight);
            if (iframeRef.current) {
                iframeRef.current.contentWindow.location.reload(true);
            }
        }, 500);
        return () => clearTimeout(applyCssUpdate);

    }, [selectedElementUserWidth, selectedElementUserHeight, selectedElementRef]);

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
            if (elements) {
                setupEventListeners(elements, elementType, handleElementSelection);
            }
        })

        handleElementHoverChange(iframeRef);

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
                    <div className="div-editor-row">
                        <div className="div-preview-iframe-container">
                            <div
                                className="title-editor-top-bar-container-colored"
                                id="title-editor-top-bar-container-iframe"
                            >
                                Preview
                            </div>
                            <iframe
                                id="iframe-code-preview"
                                srcDoc={editingIframe} // Use htmlContent or 'about:blank' if htmlContent is null
                                frameBorder="0"
                                sandbox="allow-scripts allow-same-origin"
                                ref={iframeRef}
                                onLoad={handleIframeLoad}
                            >Iframe
                            </iframe>
                        </div>
                        <div className="div-editor-flex-column">
                            <div
                                className="title-editor-top-bar-container-colored"
                                id="title-editor-top-bar-container-iframe"
                            >
                                Edit
                            </div>
                            <EditorOptionsExpandableDiv
                                title="Text Completion"
                                content={
                                    (Object.keys(parsedResponse).length > 0 || contentData) && (
                                        <TextCompletionGenerator iframeRef={iframeRef}/>
                                    )
                                }
                            />
                            <EditorOptionsExpandableDiv
                                title="Edit colors"
                                content={
                                    <div className="div-editor-options-content-container">
                                        <ColorPicker
                                            color={previewBackgroundColor}
                                            onColorChange={setPreviewBackgroundColor}
                                            title={'Background color'}
                                        />
                                        <ColorPicker
                                            color={previewDivColor}
                                            onColorChange={setPreviewDivColor}
                                            title={'Div color'}
                                        />
                                        <ColorPicker
                                            color={previewButtonColor}
                                            onColorChange={setPreviewButtonColor}
                                            title={'Button color'}
                                        />
                                    </div>
                                }
                            />
                            <EditorOptionsExpandableDiv
                                title="Element sizing"
                                content={
                                    <div className="div-editor-element-sizing-content-container">
                                        <div
                                            className="div-editor-element-sizing-content">
                                            You are
                                            selecting: {selectedElementRef ? selectedElementRef.tagName : 'None'}
                                        </div>
                                        <div
                                            className="div-editor-element-sizing-content">
                                            Width:
                                            <input
                                                className="div-editor-element-sizing-input"
                                                type="range"
                                                // value={selectedElementWidth}
                                                value={selectedElementUserWidth !== null ? selectedElementUserWidth : selectedElementOriginWidth}
                                                onChange={(e) => handleInputChange('width', e.target.value)}
                                                min="0"
                                                max={selectedElementOriginWidth * 2}
                                                placeholder="Enter width"
                                            />
                                            {selectedElementUserWidth !== null ? `${selectedElementUserWidth}px` : `${selectedElementOriginWidth}px`}
                                        </div>
                                        <div
                                            className="div-editor-element-sizing-content">
                                            Height:
                                            <input
                                                className="div-editor-element-sizing-input"
                                                type="range"
                                                // value={selectedElementHeight}
                                                value={selectedElementUserHeight !== null ? selectedElementUserHeight : selectedElementOriginHeight}
                                                onChange={(e) => handleInputChange('height', e.target.value)}
                                                min="0"
                                                max={selectedElementOriginHeight * 2}
                                                placeholder="Enter height"
                                            />
                                            {selectedElementUserHeight !== null ? `${selectedElementUserHeight}px` : `${selectedElementOriginHeight}px`}
                                        </div>
                                    </div>
                                }
                            />
                            <div className="div-editor-options">
                                <div className="title-editor-top-bar-container" id="editor-option-title">
                                    Save and regenerate
                                </div>
                                <div className="div-editor-options-content-container">
                                    <button
                                        className="button-editor"
                                        id="button-regenerate"
                                        variant="outlined"
                                        onClick={handleRegenerate}
                                    > Regenerate </button>
                                    <button
                                        className="button-editor"
                                        id="button-preview"
                                        variant="outlined"
                                        onClick={handlePreviewNavigate}
                                    >
                                        Preview
                                    </button>
                                    <button
                                        className="button-editor"
                                        id="button-save"
                                        variant="contained"
                                        onClick={handleSaveProject}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                            {/* Download as Zip button */}
                            <div className="div-editor-options">
                                <div className="title-editor-top-bar-container" id="editor-option-title">
                                    Download as Zip
                                </div>
                                <div className="div-editor-options-content-container">
                                    <button
                                        className="button-editor"
                                        id="button-download-zip"
                                        variant="contained"
                                        onClick={handleDownloadAsZip}
                                    >
                                        Download as Zip
                                    </button>
                                </div>
                            </div>
                            {/* End Download as Zip button */}
                        </div>
                    </div>
            )}
        </div>
    );
}