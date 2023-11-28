const axios = require('axios');
require('dotenv').config();

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.OPENAI_CHATGPT_API_KEY;

async function generateAutoCompletion(completionPrompt) {
    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content:
                    "Your task is to complete the following text content for a application." +
                    "Keep your answer short, 1-2 sentences."
            },
            {
                role: "user",
                content: "Complete the following text" + completionPrompt
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
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error querying ChatGPT:', error);
        throw error;
    }
}

module.exports = generateAutoCompletion;