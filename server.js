const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/analyze", async (req, res) => {
  try {
    const { image, timeframe } = req.body;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured." });
    }

    const base64Image = image.split(",")[1];

    const prompt = `
You are a professional institutional price action analyst.

Analyze the uploaded financial chart screenshot.

Identify high-quality Supply and Demand zones only.

Return STRICT JSON in this format:

{
  "zones": [
    {
      "type": "DEMAND or SUPPLY",
      "score": number (0-100),
      "confidence": number (0-100),
      "status": "FRESH/PARTIALLY_MITIGATED/MITIGATED/INVALIDATED",
      "top_percent": number (0-1),
      "bottom_percent": number (0-1),
      "left_percent": number (0-1),
      "right_percent": number (0-1),
      "reasons": [],
      "confluences": [],
      "warnings": []
    }
  ]
}

Only return valid JSON.
Do not include markdown.
Timeframe: ${timeframe}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/png",
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }
    );

    const textOutput =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      return res.status(500).json({ error: "No response from Gemini." });
    }

    const cleaned = textOutput.replace(/```json|```/g, "").trim();

    res.json(JSON.parse(cleaned));

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Gemini analysis failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
