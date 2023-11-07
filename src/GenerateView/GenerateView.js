import {sendToChatGPT} from "../Api/ChatGPT-api";
import React, {useState} from 'react';
import {useLocation} from "react-router-dom";

export default function GenerateView() {

    const location = useLocation();
    const elementData = location.state?.objectData;

    const labels = elementData.map(element => element.label);

    console.log("labels: " + JSON.stringify(labels, null, 2));

    const [responseData, setResponseData] = useState('no data yet');

    const handleSendToChatGPT = async () => {
        const response = sendToChatGPT("generate code based on these components");
        setResponseData(await response)
        const HTMLDataJSON = JSON.parse(responseData);
        console.log("response: " + JSON.stringify(response, null, 2));
    };

    return (
        <div className="generate-view-div">
            <p>Labels to generate from</p>
            <ul>
                {labels.map((label, index) => (
                    <li key={index}>{label}</li> // Display each label in a list item
                ))}
            </ul>
            <button onClick={handleSendToChatGPT}>Generate</button>
            <h2>response: </h2>
            <p>{responseData}</p>
        </div>
    );
}