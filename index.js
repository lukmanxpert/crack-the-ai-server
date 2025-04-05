const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get("/", (req, res) => {
  res.send({ message: "Let's crack the Ai" });
});

app.get("/crack-ai", async (req, res) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Explain how AI works in a few words",
  });
  res.send({ response: response.text });
});

app.listen(port, () => console.log("App is running at port", port));
