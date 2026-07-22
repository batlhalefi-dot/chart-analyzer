function renderZones(zones) {

const canvas = document.getElementById("overlayCanvas");
const img = document.getElementById("chartImage");

canvas.width = img.clientWidth;
canvas.height = img.clientHeight;

const ctx = canvas.getContext("2d");
ctx.clearRect(0,0,canvas.width,canvas.height);

zones.forEach(zone => {

const x = zone.left_percent * canvas.width;
const y = zone.top_percent * canvas.height;
const width = (zone.right_percent - zone.left_percent) * canvas.width;
const height = (zone.bottom_percent - zone.top_percent) * canvas.height;

ctx.fillStyle = zone.type === "DEMAND"
? "rgba(34,197,94,0.35)"
: "rgba(239,68,68,0.35)";

ctx.fillRect(x, y, width, height);

ctx.strokeStyle = zone.type === "DEMAND"
? "rgba(34,197,94,1)"
: "rgba(239,68,68,1)";

ctx.lineWidth = 2;
ctx.strokeRect(x, y, width, height);

});
}

function displayZoneList(zones) {

const zonesList = document.getElementById("zonesList");
zonesList.innerHTML = "";

zones.forEach(zone => {

const card = document.createElement("div");
card.className = "zone-card";
card.style.borderColor = zone.type === "DEMAND"
? "#22c55e"
: "#ef4444";

card.innerHTML = `
<strong>${zone.type} ZONE</strong><br>
Score: ${zone.score}/100<br>
Confidence: ${zone.confidence}%<br>
Status: ${zone.status}<br><br>
<strong>Reasons:</strong><br>
${zone.reasons.join("<br>")}
`;

zonesList.appendChild(card);

});
}