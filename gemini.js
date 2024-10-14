const dotenv = require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateContent = async (req, res) => {
  try {
    // Example prompt using data sent from React frontend
    const { prompt } = req.body;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ generatedText: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating content" });
  }
};

module.exports = generateContent;