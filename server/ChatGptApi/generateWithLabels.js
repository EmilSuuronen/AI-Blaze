const axios = require('axios');
require('dotenv').config();

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.OPENAI_CHATGPT_API_KEY;

async function generateWithLabels(elementData) {
    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content:
                    "Your task is to generate HTML code for a website by giving HTML and CSS code in JSON format. " +
                    "Answer ONLY in the following JSON format, do not include ANYTHING else" +
                    "{" +
                    "HTML: (HTML code as a string here)" +
                    "CSS: (CSS code as a string here)" +
                    "}" +
                    "The HTML and website code should be a single string value. Do not include newlines or any unnecessary symbols in the code. " +
                    "You will be provided with the list of components to include in the site. " +
                    "Include styling and include coloring for the components in the CSS property. " +
                    "Create a complete website: if the list of elements is only a few elements, create more to create a complete design. " +
                    "Create complete elements: Include names as text in text fields, buttons, etc. "
            },
            {
                role: "user",
                content: "List of components to include in the site: " + elementData
            }
        ],
        "max_tokens": 2000,
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

module.exports = generateWithLabels;