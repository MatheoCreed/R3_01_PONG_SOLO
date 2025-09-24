const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");


ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let score = 0;
let startTime = Date.now();
let gameOver = false;
let ecoule = 0;

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

btnLeft.addEventListener("touchstart", (e) => {
    e.preventDefault();
    paddle.dx = -paddle.speed;
});
btnLeft.addEventListener("touchend", () => {
    paddle.dx = 0;
});

btnRight.addEventListener("touchstart", (e) => {
    e.preventDefault();
    paddle.dx = paddle.speed;
});
btnRight.addEventListener("touchend", () => {
    paddle.dx = 0;
});

function movePaddle() {
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

function resetGame() {
    score = 0;
    startTime = Date.now();
    gameOver = false;
    paddle = {
        width: 60,
        height: 15,
        x: (canvas.width - 50) / 2,
        y: canvas.height - 20,
        speed: 7,
        dx: 0
    };

    ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        dx: 3,
        dy: -3
    };
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
        console.log(score);
        gameOver=true;
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

function drawGameOver() {
    
    let ecoule = Math.floor((Date.now() - startTime) / 1000)
    ctx.font = "30px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("Vous avez perdu avec un score de " + ecoule, canvas.width / 2 -110 , 
    canvas.height / 2, 220);
    ctx.fillStyle = "cyan" 
    ctx.fillText("Cliquez sur Jouer.", canvas.width / 2 -100 , canvas.height / 2 +30, 200);
}


setInterval(() => {
    if (!window.startBtnAdded) {
        window.startBtnAdded = true;
        const startBtn = document.createElement('button');
        startBtn.textContent = "Jouer";
        startBtn.style.position = "fixed";
        startBtn.style.left = "50%";
        startBtn.style.transform = "translate(-50%)";        
        document.body.appendChild(startBtn);
        
        window.timerStarted = false;
        startBtn.addEventListener('click', () => {
            window.timerStarted = true;
            startTime = Date.now();
            resetGame();
        });
    }
    
    ctx.fillStyle = "black";
    
    if (!window.timerStarted) return;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if(!gameOver){
        movePaddle();
        drawPaddle();
        moveBall();
        drawBall();
    }
    else{
        drawGameOver();
    }

}, 20);