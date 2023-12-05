const axios = require('axios');
require('dotenv').config();

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.OPENAI_CHATGPT_API_KEY;

async function generateWithVision(imageUrl) {
    const requestBody = {
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "system",
                content:
                    "Your task is to generate HTML code for a website by giving HTML and CSS code in JSON format. " +
                    "Create the code based on hand-drawn sketches of the website given to you. " +
                    "Answer ONLY in the following JSON format, do not include ANYTHING else, such as ```json markdown  " +
                    "{" +
                    "HTML: (HTML code as a string here)" +
                    "CSS: (CSS code as a string here)" +
                    "}" +
                    " " +
                    "The HTML and website code should be a single string value. Do not include newlines or any unnecessary symbols in the code. " +
                    "Include styling and include coloring for the components in the CSS property. " +
                    "Create complete elements: Include naming in text fields, buttons, etc. " +
                    "Use this link: https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/310px-Placeholder_view_vector.svg.png" +
                    "for source for images in the page."
            },
            {
                role: "user",
                content: [
                    {"type": "text", "text": "Generate the JSON object based on this image"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": imageUrl,
                            "detail": "low",
                        },
                    },
                ],
            },
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

module.exports = generateWithVision;