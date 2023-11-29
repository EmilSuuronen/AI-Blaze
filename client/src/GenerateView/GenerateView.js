import React, {useEffect, useMemo, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./GenerateView.css";
import { sendToChatGPTVision } from "../Api/ChatGPT-vision-api";
import HeaderBar from "../components/Header/HeaderBar";
import Button from "@mui/material/Button";
import { quantum } from "ldrs";
import ColorPicker from "../components/ColorPicker/ColorPicker.js";
import fetchImageData from "../script/FetchImageData.js";
import saveProject from "../script/SaveProject";
import TextCompletionGenerator from "../components/TextCompletionGenerator/TextCompletionGenerator";
import { downloadProjectAsZip } from "../DownLoadProject.js";

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

  // Handle the preview navigate
  const handlePreviewNavigate = () => {
    navigate("/preview", { state: { htmlContent: htmlContent } });
  };

    // Get the iframe element reference
    const iframeRef = useRef(null);

    const [regenerateDesign, setRegenerateDesign] = useState(false);

    useEffect(() => {
        if (docId) {
            fetchImageData(docId).then((data) => setImageData(data));
            console.log("Image data fetched " + imageData);
            if (regenerateDesign === false) {
                handleSendToChatGPTVision(imageData).then(r => console.log(r));
            }
        }
    }, [docId, imageData]);

  // Get values from labeling view and map them. If no values are passed, use vision API to generate design
  useEffect(() => {
    if (elementData != null) {
      setLabels(elementData.map((element) => element.label));
      console.log("labelsdata: " + labels);
      handleSendToChatGPT(elementData);
    } else {
      handleSendToChatGPTVision(imageData);
    }
  }, [elementData, imageData, labels]);

    // Add an useEffect to listen for changes in parsedResponse
    useEffect(() => {
        if (parsedResponse && Object.keys(parsedResponse).length > 0) {
            setIsLoading(false);
            console.log("parsedResponse: changed")
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
                body: JSON.stringify({ elementData: "generate code based on these components: " + labels })
            });
            const data = await response.json();
            setParsedResponse(JSON.parse(data));
            await handleSaveProject();
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
                body: JSON.stringify({ imageUrl: imageData })
            });
            const data = await response.json();
            setParsedResponse(JSON.parse(data));
            await handleSaveProject();
            setRegenerateDesign(true);
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
    console.log("Saving project: " + htmlContent);
    await saveProject(docId, htmlContent);
    console.log("Project saved");
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

  return (
    <div className="generate-view-main">
      <HeaderBar />
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
                ref={iframeRef}
                srcDoc={htmlContent || "about:blank"} // Use htmlContent or 'about:blank' if htmlContent is null
                frameBorder="0"
                sandbox="allow-scripts allow-same-origin"
              >
                Iframe
              </iframe>
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
                      <TextCompletionGenerator parsedResponse={parsedResponse} iframeRef={iframeRef} />
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