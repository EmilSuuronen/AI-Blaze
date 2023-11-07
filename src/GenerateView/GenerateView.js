import {sendToChatGPT} from "../Api/ChatGPT-api";
import React, {useEffect, useMemo, useState} from 'react';
import {useLocation} from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function GenerateView() {

    const location = useLocation();
    const elementData = location.state?.objectData;

    const labels = elementData.map(element => element.label);

    console.log("labels: " + JSON.stringify(labels, null, 2));

    const [responseData, setResponseData] = useState('no data yet');
    const [parsedResponse, setParsedResponse] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (elementData == null) {
            handleNavigate();
        }
        handleSendToChatGPT();
    }, []);

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

    const testJson  = {
        HTML: "<button class=\"button\">Button</button><input type=\"email\" class=\"input\" placeholder=\"Email\"><input type=\"password\" class=\"input\" placeholder=\"Password\"><input type=\"text\" class=\"search-bar\" placeholder=\"Search\">",
        CSS: ".button { background-color: #4CAF50; color: white; padding: 8px 16px; border: none; text-align: center; text-decoration: none; display: inline-block; font-size: 14px; margin: 4px 2px; cursor: pointer;} .input { padding: 6px 10px; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box; margin-bottom: 10px;} .search-bar { padding: 6px 10px; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box; margin-bottom: 10px;}"
    }

    function testJson2() {
        console.log(JSON.stringify(parsedResponse))
    }

    // useMemo hook will re-compute when parsedResponse changes
    const htmlContent = useMemo(() => {
        // If parsedResponse is not yet populated, return null or some fallback content
        if (isLoading || !parsedResponse.HTML || !parsedResponse.CSS) {
            return null;
        }
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
        }
          ${parsedResponse.CSS}
        </style>
      </head>
      <body>
        ${parsedResponse.HTML}
      </body>
      </html>
    `;
    }, [isLoading, parsedResponse]);

    return (
        <div className="generate-view-div">
            {isLoading ? (
                <p>Loading...</p> // Show loading text while waiting for response
            ) : (
                <iframe
                    srcDoc={htmlContent || 'about:blank'} // Use htmlContent or 'about:blank' if htmlContent is null
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    sandbox="allow-scripts"
                ></iframe>
            )}
            <h2>Response: </h2>
            <p>{responseData}</p>
        </div>
    );
}