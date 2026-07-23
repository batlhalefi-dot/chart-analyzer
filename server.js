const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/analyze", async (req, res) => {
  try {
    const { image, timeframe } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.0-pro-vision-latest"
    });

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

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image
        }
      }
    ]);

    const response = await result.response;
    const textOutput = response.text();

    const cleaned = textOutput.replace(/```json|```/g, "").trim();

    res.json(JSON.parse(cleaned));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gemini analysis failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
