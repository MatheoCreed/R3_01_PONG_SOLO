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

let paddle = {
    width: 60,
    height: 15,
    x: (canvas.width - 100) / 2,
    y: canvas.height - 10,
    speed: 7,
    dx: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 3,
    dy: -3
};

document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") paddle.dx = -paddle.speed;
    if (e.key === "ArrowRight") paddle.dx = paddle.speed;
});
document.addEventListener('keyup', (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") paddle.dx = 0;
});

function movePaddle() {
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

function drawPaddle() {
    ctx.fillStyle = "blue";    
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle="red";
    ctx.stroke;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    if (
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        ball.dy = -ball.dy;
        score++;
        let ballSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        let speedIncrease = 0.3;
        ballSpeed += speedIncrease;
        let angle = Math.atan2(ball.dy, ball.dx);
        ball.dx = ballSpeed * Math.cos(angle);
        ball.dy = ballSpeed * Math.sin(angle);
    }

    if (ball.y + ball.radius > canvas.height) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        score = 0;
        startTime = Date.now();
        ball.dx = 3;
        ball.dy = -3;
    }
    
}


function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.stroke();
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

    movePaddle();
    drawPaddle();
    moveBall();
    drawBall();
    dessinerScore();
}, 20);