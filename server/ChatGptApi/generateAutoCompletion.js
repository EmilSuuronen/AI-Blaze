const axios = require('axios');
require('dotenv').config();

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.OPENAI_CHATGPT_API_KEY;

async function generateAutoCompletion(elementType, completionPrompt) {

    console.log("elementype: " + elementType);
    console.log("completionPrompt: " + completionPrompt);
    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content:
                    "Your task is to generate auto completions for a website elements." +
                    "You will be given an elementType: (which is the type of element to create)" +
                    "and a promptDescription: (which is the description for the element to create)" +
                    "This is how you should handle the different elementType variable: " +
                    "Paragraph: respond a longer an description for the element. " +
                    "Title: Give a simple 1-5 word title for the element. " +
                    "Button text: give only a 1-2 word text that would be inside a button. " +
                    "List item: give a 1-5 word description for the list item. " +
                    "Answer shortly and concisely. Create text according to these elements to what you would find inside a real website/application" +
                    "Do not include anything unnecessary in the answer, such as greetings, descriptions, symbols. Only output the text."
            },
            {
                role: "user",
                content: "elementType: " + elementType + "promptDescription: " + completionPrompt
            }
        ],
        "max_tokens": 400,
    };

    try {
        const response = await axios.post(OPENAI_URL, requestBody, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("response.data.choices[0].message.content from generate: " + response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error querying ChatGPT:', error);
        throw error;
    }
}

module.exports = generateAutoCompletion;