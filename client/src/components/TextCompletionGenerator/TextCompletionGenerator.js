import React, {useState, useEffect} from 'react';
import "./TextCompletionGenerator.css";

const TextCompletionGenerator = ({iframeRef}) => {
    const [prompt, setPrompt] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [selectedElementId, setSelectedElementId] = useState(null);
    const validTagNames = ['BUTTON', 'DIV', 'P', 'LABEL', 'SPAN', 'LI', 'INPUT', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    const [isBlinking, setIsBlinking] = useState(false);

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
    }, [iframeRef, prompt, validTagNames]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'textClick') {
                // Update the prompt field with the clicked text content
                setPrompt(event.data.content);
                setGeneratedText(event.data.content);
                setSelectedElementId(event.data.elementId);
            } else if (event.data.type === 'updateTextContent') {
                // Update the generatedText state when a message to update text content is received
                setGeneratedText(event.data.content);
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
    }, [prompt, generatedText, selectedElementId, iframeRef]);

    const handleGeneratedTextChange = (e) => {
        const newText = e.target.value;

        setPrompt(e.target.value)
        // Update the generatedText state
        setGeneratedText(newText);

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

    // Function to generate text using AI
    const generateText = async () => {
        if (!prompt) {
            alert('Please provide a prompt before generating!');
            return;
        }

        // Call your AI function here with the prompt
        try {
            const response = await fetch('/generate-auto-completion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completionPrompt: prompt })
            });
            const data = await response.json();
            setGeneratedText(data);
        } catch (error) {
            console.error("Failed to generate response:", error);
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
    }, [prompt]);
    return (
        <div className="div-flex-text-completion-main">
            <div className="div-text-completion-section">
                <h4>Selected text</h4>
                <input
                    type="text"
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    readOnly
                    className={`input-text-completion-selected-text ${isBlinking ? 'blinking-border' : ''}`}
                />
            </div>
            <div className="div-text-completion-section">
                <h4>Edit text</h4>
                <textarea
                    id="generatedText"
                    value={generatedText}
                    onChange={handleGeneratedTextChange}
                    className="input-text-completion-text"
                />
            </div>
            <div className="div-text-completion-section">
                <h4>Generate text</h4>
                <p> Here you can create a prompt to automatically generate content for your site.
                    For example, *Create a description for an shop item for bicycle*
                </p>
                <textarea
                    id="generatedText"
                    value={generatedText}
                    onChange={handleGeneratedTextChange}
                    className="input-text-completion-text"
                />
            </div>
            <div>
                <button onClick={generateText}>Generate</button>
            </div>
        </div>
    );
};

export default TextCompletionGenerator;