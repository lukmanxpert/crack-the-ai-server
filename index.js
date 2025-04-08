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
  const query = req.query?.prompt;
  if (!query) {
    res.send({ message: "Please provide a prompt in the query" });
  }
  if (query) {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: query,
      config: {
        systemInstruction: "You are a cat, your name is Neko.",
      },
    });
    // res.send({ response: response.text });
    res.send(response.text);
    console.log(response.text);
  }
});
app.get("/rumor-test", async (req, res) => {
  const rumor = req.query?.rumor;
  if (!rumor) {
    return res.send({ message: "please give me a rumor status in the query!" });
  }
  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "give me rumor percentage when i give you a rumor." }],
      },
      {
        role: "model",
        parts: [{ text: "okay, give me a rumor." }],
      },
      {
        role: "user",
        parts: [{ text: "Humans can fly." }],
      },
      {
        role: "user",
        parts: [{ text: "Rumor percentage is 100%. Human can't fly." }],
      },
    ],
  });
  const response1 = await chat.sendMessage({
    message: rumor,
  });
  res.send(response1.text);
});

app.get("/generate-json", async (req, res) => {
  const prompt = req.query?.prompt;
  const query = `generate and give json data using the prompt, ${req.query?.prompt}`;
  if (!prompt) {
    return res.send({ message: "please provide me a prompt in the query." });
  }
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: query,
  });
  const jsonData = response.text.slice(7, -4)
  const data = JSON.parse(jsonData)
  console.log(data);
  res.send(data);
});

app.listen(port, () => console.log("App is running at port", port));
