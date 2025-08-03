const canvas = document.getElementById("bg-animation");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lines = [];

for (let i = 0; i < 60; i++) {
  lines.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    length: Math.random() * 200 + 100,
    speed: Math.random() * 0.8 + 0.2
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#00ccff";
  ctx.lineWidth = 1;
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#00ccff";

  lines.forEach((line) => {
    ctx.beginPath();
    ctx.moveTo(line.x, line.y);
    ctx.lineTo(line.x, line.y + line.length);
    ctx.stroke();

    line.y += line.speed;
    if (line.y > canvas.height) {
      line.y = -line.length;
      line.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(draw);
}

draw();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
