require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

console.log("API KEY:", process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Say hello in one sentence",
    });

    console.log("RESULT:", response.text);
  } catch (err) {
    console.error("TEST ERROR:", err);
  }
}

test();
