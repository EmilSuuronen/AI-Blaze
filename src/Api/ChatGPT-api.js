const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = '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';

export const sendToChatGPT = async (message) => {
    try {
        const requestBody = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "Your task is to generate HTML code for a website by giving HTML and CSS code in JSON format\n" +
                        "Answer ONLY in the following JSON format, do not include ANYTHING else:\n" +
                        "{\n" +
                        "  HTML: [String]\n" +
                        "}\n" +
                        "{\n" +
                        "  CSS: [String]\n" +
                        "}\n" +
                        "You will be provided with the list of components to include in the site" +
                        "Include basic styling and coloring for the components, And place them accoringly to a mobile view."
                },
                {
                    role: "user",
                    content: "List of components to include in the site: " + message
                }
            ]
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