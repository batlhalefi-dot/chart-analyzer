const chartUpload = document.getElementById("chartUpload");
const analyzeBtn = document.getElementById("analyzeBtn");
const chartImage = document.getElementById("chartImage");
const analysisSection = document.querySelector(".analysis-section");
const loadingOverlay = document.getElementById("loadingOverlay");
const zonesList = document.getElementById("zonesList");

let uploadedImageBase64 = null;

chartUpload.addEventListener("change", function(e) {
const file = e.target.files[0];
const reader = new FileReader();

reader.onload = function(event) {
uploadedImageBase64 = event.target.result;
chartImage.src = uploadedImageBase64;
analysisSection.classList.remove("hidden");
};

reader.readAsDataURL(file);
});

analyzeBtn.addEventListener("click", async () => {

if (!uploadedImageBase64) {
alert("Please upload a chart screenshot.");
return;
}

loadingOverlay.classList.remove("hidden");

const timeframe = document.getElementById("timeframe").value;

const result = await analyzeChartWithAI(uploadedImageBase64, timeframe);

loadingOverlay.classList.add("hidden");

renderZones(result.zones);
displayZoneList(result.zones);

});