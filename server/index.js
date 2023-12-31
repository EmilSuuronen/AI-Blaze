const express = require('express');
const app = express();
const axios = require('axios');
const generateWithVision = require("./ChatGptApi/generateWithVision");
const generateWithLabels = require("./ChatGptApi/generateWithLabels");
const generateAutoCompletion = require("./ChatGptApi/generateAutoCompletion");

app.use(express.json());

app.post('/generate-with-vision', async (req, res) => {
    try {
        const imageUrl = req.body.imageUrl;
        const result = await generateWithVision(imageUrl);
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing your request');
    }
});

app.post('/generate-with-labels', async (req, res) => {
    try {
        const elementData = req.body.elementData;
        const result = await generateWithLabels(elementData);
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing your request');
    }
});

app.post('/generate-auto-completion', async (req, res) => {
    try {
        const elementType = req.body.elementType;
        const completionPrompt = req.body.completionPrompt;
        const result = await generateAutoCompletion(elementType, completionPrompt);
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing your request');
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));

