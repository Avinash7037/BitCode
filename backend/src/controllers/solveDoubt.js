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

    if (!messages.length || !messages[messages.length - 1]?.content?.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const systemContext = `
You are an expert DSA tutor.

IMPORTANT RESPONSE FORMAT RULES (MANDATORY):
- Respond ONLY in MARKDOWN
- Use proper headings (###)
- Use bullet points and numbered lists
- Use **bold** for key terms
- Use \`inline code\`
- Use fenced code blocks with language tags
- Use mathematical symbols (O(n), ≤, ≥)

STRUCTURE:
### Explanation
### Approach
### Code (only if asked)
### Complexity

PROBLEM:
Title: ${title}

Description:
${description}

Examples:
${JSON.stringify(testCases, null, 2)}

Starter Code:
${startCode}

RULES:
- Stay within this problem
- Give hints first unless full solution is asked
`;

    const contents = messages.map((m) => ({
      role: "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      systemInstruction: systemContext,
      contents,
    });

    const aiText =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    res.status(200).json({
      message: aiText,
    });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ message: "AI error" });
  }
};

module.exports = solveDoubt;
