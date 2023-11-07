const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = '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';

export const sendToChatGPT = async (elementData) => {

    try {
        const requestBody = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "Your task is to generate HTML code for a website by giving HTML and CSS code in JSON format" +
                        "Answer ONLY in the following JSON format, do not include ANYTHING else" +
                        "HTML: {}" +
                        "CSS: {}" +
                        "The HTML and website code should be a single string value. Do not include /n or any other line breaks or symbols" +
                        "You will be provided with the list of components to include in the site" +
                        "Include basic styling and coloring for the components in the css property"
                },
                {
                    role: "user",
                    content: "List of components to include in the site: " + elementData
                }
            ],
            stream: true
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

        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error querying ChatGPT:', error);
        throw error;
    }
};