const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const API_KEY = process.env.OPENAI_API_KEY;

app.post('/analyze', async (req, res) => {
try {

const { image, timeframe } = req.body;

const response = await axios.post('https://api.openai.com/v1/chat/completions', {
model: "gpt-4o-mini",
messages: [
{
role: "system",
content: "Analyze the chart screenshot and return ONLY JSON with supply and demand zones using normalized percentages."
},
{
role: "user",
content: [
{ type: "text", text: `Timeframe: ${timeframe}` },
{ type: "image_url", image_url: { url: image } }
]
}
],
temperature: 0.2
},
{
headers: {
'Authorization': `Bearer ${API_KEY}`,
'Content-Type': 'application/json'
}
}
);

res.json(JSON.parse(response.data.choices[0].message.content));

} catch (error) {
console.error(error.response?.data || error.message);
res.status(500).json({ error: "Analysis failed" });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));