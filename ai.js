async function analyzeChartWithAI(imageBase64, timeframe) {

const BACKEND_URL = "https://chart-analyzer-r2jr.onrender.com";

try {

const response = await fetch(BACKEND_URL, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
image: imageBase64,
timeframe: timeframe
})
});

if (!response.ok) throw new Error("Server error");

const data = await response.json();
return data;

} catch (e) {
console.error("Analysis Error:", e);
alert("Server is waking up or error occurred. Please try again in 30 seconds.");
return { zones: [] };
}

}
