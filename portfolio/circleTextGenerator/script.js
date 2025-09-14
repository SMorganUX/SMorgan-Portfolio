const canvas = document.getElementById("circleCanvas");
const ctx = canvas.getContext("2d");
let customFontName = "CustomCircleFont"; // name we'll assign to the loaded font

async function makeCircle() {
  const text = document.getElementById("inputText").value || "Circle Text Example";
  const fontUrl = document.getElementById("fontURL").value.trim();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Load custom font size if provided
  let fontSize = parseInt(document.getElementById("fontSize").value, 10) || 20;
  // Load custom letter spacing if provided
  let letterSpacing = parseInt(document.getElementById("letterSpacing").value, 10) || 0;
  // Load custom font color if provided
  let fontColor = document.getElementById("fontColor").value.trim() || "#000000";

  // Load custom font if provided
  if (fontUrl) {
    try {
      const fontFace = new FontFace(customFontName, `url(${fontUrl})`);
      await fontFace.load();
      document.fonts.add(fontFace);
    } catch (e) {
      console.error("Failed to load font:", e);
    }
  }

  ctx.font = `${fontSize}px ${fontUrl ? customFontName : "sans-serif"}`;
  ctx.fillStyle = `${fontColor}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // --- Improved radius & angle calculation ---
  // Estimate width per character = fontSize (roughly) + letterSpacing
  const estimatedWidth = fontSize + letterSpacing;
  const totalArcLength = text.length * estimatedWidth;
  const radius = totalArcLength / (2 * Math.PI);

  // compute arc per char
  let currentAngle = -Math.PI / 2; // start at top
  const anglePerChar = estimatedWidth / radius; // radians per char

  text.split("").forEach((char) => {
    const x = centerX + radius * Math.cos(currentAngle);
    const y = centerY + radius * Math.sin(currentAngle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(currentAngle + Math.PI / 2); // keep letters upright
    ctx.fillText(char, 0, 0);
    ctx.restore();

    // Move forward by one char + spacing
    currentAngle += anglePerChar;
  });
}

// converts the generated text circle into a png for download
function downloadImage() {
  const link = document.createElement("a");
  link.download = "circle-text.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
