const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY,
});

const solveDoubt = async (req, res) => {
  try {
    const {
      messages = [],
      title,
      description,
      testCases,
      startCode,
    } = req.body;

    if (!messages.length) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content?.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // ✅ PROBLEM CONTEXT AS USER MESSAGE (CRITICAL FIX)
    const problemContext = `
You are an expert Data Structures and Algorithms tutor.

Answer STRICTLY based on the following problem.

### Problem Title
${title}

### Problem Description
${description}

### Examples
${JSON.stringify(testCases, null, 2)}

### Starter Code
${startCode}

### Rules
- Stay within this problem
- Give hints first unless full solution is explicitly asked
- Respond ONLY in Markdown
- Use headings, bullet points, code blocks, and Big-O notation
`;

    // ✅ Gemini-compatible message structure
    const contents = [
      {
        role: "user",
        parts: [{ text: problemContext }],
      },
      {
        role: "user",
        parts: [{ text: lastMessage.content }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
    });

    const aiText =
      response?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "⚠️ No response from AI.";

    return res.status(200).json({ message: aiText });
  } catch (err) {
    console.error("Gemini Error:", err);
    return res.status(500).json({
      message: "Error from AI Chatbot",
    });
  }
};

module.exports = solveDoubt;
