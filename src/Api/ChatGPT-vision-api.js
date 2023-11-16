const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
//const API_KEY = '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';
const API_KEY = "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";

export const sendToChatGPTVision = async () => {
  try {
    const requestBody = {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content:
            "Your task is to generate HTML code for a website by giving HTML and CSS code in JSON format. " +
            "Create the code based on hand-drawn sketches of the website given to you. " +
            "Answer ONLY in the following JSON format, do not include ANYTHING else. " +
            "{" +
            "HTML: (HTML code as a string here)" +
            "CSS: (CSS code as a string here)" +
            "}" +
            " " +
            "The HTML and website code should be a single string value. Do not include newlines or any unnecessary symbols in the code. " +
            "Include styling and include coloring for the components in the CSS property. " +
            "Create complete elements: Include naming in text fields, buttons, etc. ",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Generate the JSON object based on this image",
            },
            {
              type: "image_url",
              image_url:
                "https://i.gyazo.com/3f944aa0cbf32eae21bd9978b807ce6e.png",
            },
          ],
        },
      ],
      max_tokens: 2000,
    };

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log(data.choices[0].message.content);

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error querying ChatGPT:", error);
    throw error;
  }
};
