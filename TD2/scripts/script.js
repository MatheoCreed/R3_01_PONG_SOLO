const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let score = 0;
let startTime = Date.now();

function dessinerScore() {
    let ecoule = Math.floor((Date.now() - startTime) / 1000);

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 20, 30);
    ctx.fillText("Temps: " + ecoule + "s", canvas.width - 120, 30);
}
setInterval(() => {
    if (!window.startBtnAdded) {
        window.startBtnAdded = true;
        const startBtn = document.createElement('button');
        startBtn.textContent = "Jouer";
        startBtn.style.position = "absolute";
        document.body.appendChild(startBtn);

        window.timerStarted = false;
        startBtn.addEventListener('click', () => {
            window.timerStarted = true;
            startTime = Date.now();
        });
    }

    ctx.fillStyle = "black";

    if (!window.timerStarted) return;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    dessinerScore();
}, 1000);