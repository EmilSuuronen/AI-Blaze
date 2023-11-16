import {sendToChatGPT} from "../Api/ChatGPT-api";
import React, {useEffect, useMemo, useState} from 'react';
import {useLocation} from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import "./GenerateView.css";
import {sendToChatGPTVision} from "../Api/ChatGPT-vision-api";
import HeaderBar from "../components/Header/HeaderBar";
import Button from "@mui/material/Button";
import { quantum } from 'ldrs';
import ColorPicker from '../components/ColorPicker/ColorPicker.js';

export default function GenerateView() {

    const location = useLocation();
    const elementData = location.state?.objectData;
    const [labels, setLabels] = useState(null);

    const [responseData, setResponseData] = useState('no data yet');
    const [parsedResponse, setParsedResponse] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    quantum.register()

    const navigate = useNavigate();

    const [previewBackgroundColor, setPreviewBackgroundColor] = useState('#cbcbcb');
    const [previewButtonColor, setPreviewButtonColor] = useState('#cbcbcb');
    const [previewDivColor, setPreviewDivColor] = useState('#cbcbcb');

    useEffect(() => {
        if (elementData != null) {
            setLabels(elementData.map(element => element.label));
            //handleSendToChatGPT();
        } else {
            //handleSendToChatGPTVision();
        }
    }, [elementData]);

    const handleNavigate = () => {
        navigate('/createNewProject');
    };

    const handleSendToChatGPT = async () => {
        console.log("Generation started");
        setIsLoading(true);
        try {
            const response = await sendToChatGPT("generate code based on these components: " + JSON.stringify(labels));
            const data = await response;
            setResponseData(data);
            setParsedResponse(JSON.parse(data));
        } catch (error) {
            console.error("Failed to generate response:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendToChatGPTVision = async () => {
        console.log("Generation with vision started");
        setIsLoading(true);
        try {
            const response = await sendToChatGPTVision();
            const data = await response;
            setResponseData(data);
            setParsedResponse(JSON.parse(data));
        } catch (error) {
            console.error("Failed to generate response:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const testJson = {
        HTML: "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Product Page</title></head><body><header><nav><button id='menu-btn'>☰</button><input type='search' id='search-bar' placeholder='Search...'><button id='cart-btn'>🛒</button><button id='profile-btn'>👤</button></nav></header><main><section id='product-image'><button id='prev-btn'>⟨</button><img src='https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg' alt='Product Image'><button id='next-btn'>⟩</button></section><div id='image-indicators'><span>⚪</span><span>⚪</span><span>⚪</span></div><button id='fav-btn'>❤</button><article id='product-details'><div id='description'></div></article><section id='product-selection'><label for='color-select'>Color:</label><select id='color-select'><option selected>Choose color</option></select><div id='quantity-selector'><button>-</button><input type='text' value='1'><button>+</button></div></section><button id='add-to-trolley'>ADD TO TROLLEY</button></main></body></html>",
        CSS: "body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; } header { display: flex; justify-content: space-between; background: #f8f8f8; padding: 10px; } nav button { background: none; border: none; font-size: 20px; } #search-bar { flex-grow: 1; margin: 0 10px; } #product-image { text-align: center; position: relative; } #prev-btn, #next-btn { position: absolute; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 20px; } #prev-btn { left: 0; } #next-btn { right: 0; } #image-indicators { text-align: center; } #image-indicators span { font-size: 20px; } #fav-btn { background: none; border: none; float: right; font-size: 20px; } #product-details { padding: 20px; } #description { height: 100px; background: #eaeaea; margin-bottom: 20px; } #product-selection { display: flex; align-items: center; margin: 20px; } #color-select { margin-right: 10px; } #quantity-selector { display: flex; align-items: center; } #quantity-selector button { background: none; border: 1px solid #ccc; } #quantity-selector input { text-align: center; width: 30px; } #add-to-trolley { width: calc(100% - 40px); padding: 10px; background: #ff4500; color: white; border: none; margin: 20px; cursor: pointer; }"
    }

    // useMemo hook will re-compute when parsedResponse changes
    const htmlContent = useMemo(() => {
        // If parsedResponse is not yet populated, return null or some fallback content
        /*
        if (isLoading || !parsedResponse.HTML || !parsedResponse.CSS) {
            return null;
        }
         */
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
            min-height: 40vh;
            background-color: ${previewBackgroundColor};
            padding: 8px;
        }
        button{
        background-color: ${previewButtonColor};
        }
        div{
        background-color: ${previewDivColor};
        }
        ${testJson.CSS}
        </style>
      </head>
      <body>
        ${testJson.HTML}
      </body>
      </html>
    `;
    }, [previewBackgroundColor, previewButtonColor, previewDivColor, testJson.CSS, testJson.HTML]);

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
                    <div className="div-editor-row">
                        <div className="div-preview-iframe-container">
                            <div>
                                <h2 style={{color: 'black'}}>Your application</h2>
                            </div>
                            <iframe
                                id="iframe-code-preview"
                                srcDoc={htmlContent || 'about:blank'} // Use htmlContent or 'about:blank' if htmlContent is null
                                frameBorder="0"
                                sandbox="allow-scripts allow-same-origin"
                            >Iframe</iframe>
                        </div>
                        <div className="div-editor-flex-column">
                            <div className="div-editor-options" id="div-color-options">
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
                            <div className="div-editor-options">
                                <div>Button sizing</div>
                            </div>
                            <div className="div-editor-options">
                                <div>
                                    Text content
                                </div>
                            </div>
                            <div className="div-editor-options">
                                <div>
                                    <Button id="button-generate" variant="contained" onClick={handleSendToChatGPTVision}>
                                        Regenerate
                                    </Button>
                                    <Button id="button-generate" variant="contained">
                                        Save project
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