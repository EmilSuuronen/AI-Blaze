import React, {useState, useEffect} from 'react';
import "./TextCompletionGenerator.css";

const TextCompletionGenerator = ({iframeRef}) => {
    const [selectedText, setSelectedText] = useState('');
    const [editedText, setEditedText] = useState('');
    const [generatedText, setGeneratedTExt] = useState('');
    const [selectedElementId, setSelectedElementId] = useState(null);
    const validTagNames = ['BUTTON', 'DIV', 'P', 'LABEL', 'SPAN', 'LI', 'INPUT', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    const [isBlinking, setIsBlinking] = useState(false);
    const [selectedElementValue, setSelectedElementValue] = useState('');

    useEffect(() => {
        const handleClick = (event) => {
            const clickedTagName = event.target.tagName;
            // Check if the clicked element is a text element
            if (validTagNames.includes(clickedTagName)) {
                // Send the text content to the parent window
                const textContent = event.target.textContent;
                let elementId = event.target.id;

                // If the clicked element doesn't have an id, generate one
                if (!elementId) {
                    elementId = `generatedId_${Math.random().toString(36).substr(2, 9)}`;
                    event.target.id = elementId; // Add the generated id to the element
                }

                window.parent.postMessage({
                    type: 'textClick',
                    content: textContent,
                    elementId: elementId,
                }, '*'); // '*' allows communication with any origin
            }
        };

        // Add click event listener to the iframe content
        iframeRef.current.contentWindow.document.body.addEventListener('click', handleClick);
        return () => {
            if (iframeRef.current) {
                iframeRef.current.contentWindow.document.body.removeEventListener('click', handleClick);
            }
        };
    }, [iframeRef, selectedText, validTagNames]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'textClick') {
                // Update the prompt field with the clicked text content
                setSelectedText(event.data.content);
                setEditedText(event.data.content);
                setSelectedElementId(event.data.elementId);
            } else if (event.data.type === 'updateTextContent') {
                // Update the generatedText state when a message to update text content is received
                setEditedText(event.data.content);
                // Update the content of the selected element in the iframe
                if (selectedElementId) {
                    const selectedElement = iframeRef.current.contentDocument.getElementById(selectedElementId);
                    if (selectedElement) {
                        selectedElement.textContent = event.data.content;
                    }
                }
            } else if (event.data.type === 'updateTextContentWithGeneratedText') {
                // Update the generatedText state when a message to update text content is received
                setEditedText(event.data.content);
                // Update the content of the selected element in the iframe
                if (selectedElementId) {
                    const selectedElement = iframeRef.current.contentDocument.getElementById(selectedElementId);
                    if (selectedElement) {
                        selectedElement.textContent = event.data.content;
                    }
                }
            }
        };

        // Add message event listener to the window
        window.addEventListener('message', handleMessage);

        return () => {
            // Remove the event listener when the component unmounts
            window.removeEventListener('message', handleMessage);
        };
    }, [selectedText, editedText, selectedElementId, iframeRef]);

    const handleEditedTextChange = (e) => {
        const newText = e.target.value;
        setEditedText(newText);

        // Send a message to the iframe to update the content of the selected text element
        if (iframeRef) {
            window.parent.postMessage(
                {
                    type: 'updateTextContent',
                    elementId: selectedElementId, // Provide the ID of the selected text element
                    content: newText,
                },
                '*'
            );
        }
    };

    // Function to call the server and fetch and generate text using ChatGPT API
    const generateText = async () => {
        if (!selectedText) {
            alert('Please provide a prompt before generating!');
            return;
        }
        try {
            const response = await fetch('/generate-auto-completion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({elementType: selectedElementValue,completionPrompt: selectedText})
            });
            const data = await response.json();
            handleGeneratedTextChange(data);
        } catch (error) {
            console.error("Failed to generate response:", error);
        }
    };

    const handleGeneratedTextChange = (responseData) => {
        setEditedText(responseData);

        // Send a message to the iframe to update the content of the selected text element
        if (iframeRef) {
            window.parent.postMessage(
                {
                    type: 'updateTextContentWithGeneratedText',
                    elementId: selectedElementId, // Provide the ID of the selected text element
                    content: responseData,
                },
                '*'
            );
        }
    };

    useEffect(() => {
        // Trigger the blinking animation when the prompt changes
        setIsBlinking(true);

        // Reset the blinking state after the animation duration
        const timeoutId = setTimeout(() => {
            setIsBlinking(false);
        }, 300); // Adjust the duration to match the animation duration

        return () => {
            clearTimeout(timeoutId);
        };
    }, [selectedText]);

    // Handler function to update the selected value
    const handleSelectChange = (event) => {
        setSelectedElementValue(event.target.value);
    };

    return (
        <div className="div-flex-text-completion-main">
            <div className="div-text-completion-section">
                <h4>Selected text</h4>
                <input
                    type="text"
                    id="prompt"
                    value={selectedText}
                    onChange={(e) => setSelectedText(e.target.value)}
                    readOnly
                    className={`input-text-completion-selected-text ${isBlinking ? 'blinking-border' : ''}`}
                />
            </div>
            <div className="div-text-completion-section">
                <h4>Edit text</h4>
                <textarea
                    id="generatedText"
                    value={editedText}
                    onChange={handleEditedTextChange}
                    className="input-text-completion-text"
                />
            </div>
            <div className="div-text-completion-section">
                <h4>Generate text</h4>
                <div className="info-box-text-generation">
                    <p>Here you can create a prompt to automatically generate content for your site. </p>
                    <i>For example, *Create a description for an shop item for a bicycle*</i>
                    <p>Choose the text type and create a prompt</p>
                </div>
                <h4>Select text type</h4>
                <select id="selector" value={selectedElementValue} onChange={handleSelectChange}
                        className="selector-text-completion-text-type">
                    <option value="default">Paragraph</option>
                    <option value="title">Title</option>
                    <option value="description">Description</option>
                    <option value="button text">Button text</option>
                    <option value="list item">List item</option>
                </select>
                <textarea
                    id="generatedText"
                    value={editedText}
                    onChange={handleEditedTextChange}
                    className="input-text-completion-text"
                />
                <button onClick={generateText} className="button-text-completion-generate">Generate</button>
            </div>
        </div>
    );
};

export default TextCompletionGenerator;