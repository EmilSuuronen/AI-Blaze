
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = "";

export const sendToChatGPT = async (elementData) => {
console.log("api_key: " + API_KEY);
    try {
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
                        "You CAN add your own components to make the site more complete. " +
                        "Create complete elements: Include naming in text fields, buttons, etc. "
                },
                {
                    role: "user",
                    content: "List of components to include in the site: " + elementData
                }
            ],
            "max_tokens": 2000,
        };

        const response = await fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        console.log(data.choices[0].message.content)

        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error querying ChatGPT:', error);
        throw error;
    }
};