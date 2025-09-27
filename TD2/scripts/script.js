const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const scoreAffichage = document.getElementById("scoreAffichage");
const settingsBtn = document.getElementById('settingsBtn');
const settingsDiv = document.getElementById('settings');

const bestScoreAffichage = document.getElementById("bestScoreAffichage");
const bgColorInput = document.getElementById("bgColor");
const paddleColorInput = document.getElementById("paddleColor");
const ballColorInput = document.getElementById("ballColor");
const accelRange = document.getElementById("accelRange");
const accelNumber = document.getElementById("accelNumber");
const saveSettingsBtn = document.getElementById("saveSettings");
const resetBestBtn = document.getElementById("resetBest");


ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let score = 0;
let startTime = Date.now();
let gameOver = false;
let ecoule = 0;
let ecoulePerdu = 0;

let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
const SETTINGS = {
    bgColor: localStorage.getItem('bgColor') || '#c8c8c8',
    paddleColor: localStorage.getItem('paddleColor') || 'blue',
    ballColor: localStorage.getItem('ballColor') || 'red',
    acceleration: parseFloat(localStorage.getItem('acceleration')) || 0.3
};


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

function openSettings() {
  settingsDiv.classList.add('open');
  settingsDiv.setAttribute('aria-hidden', 'false');
  settingsBtn.setAttribute('aria-expanded', 'true');
}

function closeSettings() {
  settingsDiv.classList.remove('open');
  settingsDiv.setAttribute('aria-hidden', 'true');
  settingsBtn.setAttribute('aria-expanded', 'false');
}

settingsBtn.addEventListener('click', () => {
  if (settingsDiv.classList.contains('open')) closeSettings();
  else openSettings();
});

if (typeof saveSettingsBtn !== 'undefined') {
  saveSettingsBtn.addEventListener('click', () => {
    setTimeout(closeSettings, 250); 
  });
}

document.addEventListener('click', (e) => {
  if (!settingsDiv.classList.contains('open')) return;
  if (!settingsDiv.contains(e.target) && e.target !== settingsBtn) {
    closeSettings();
  }
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
    SETTINGS.acceleration = parseFloat(localStorage.getItem('acceleration')) || SETTINGS.acceleration;
    SETTINGS.bgColor = localStorage.getItem('bgColor') || SETTINGS.bgColor;
    SETTINGS.paddleColor = localStorage.getItem('paddleColor') || SETTINGS.paddleColor;
    SETTINGS.ballColor = localStorage.getItem('ballColor') || SETTINGS.ballColor;
    canvas.style.backgroundColor = SETTINGS.bgColor;

}

function drawPaddle() {
    ctx.fillStyle = SETTINGS.paddleColor;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = "red";

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
        ballSpeed += SETTINGS.acceleration;
        let angle = Math.atan2(ball.dy, ball.dx);
        ball.dx = ballSpeed * Math.cos(angle);
        ball.dy = -Math.abs(ballSpeed * Math.sin(angle));
    }

    if (ball.y + ball.radius > canvas.height) {
        console.log(score);
        gameOver=true;
    }
    
}


function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = SETTINGS.ballColor;
    ctx.fill();
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.stroke();
}


function drawGameOver() {
    let ecoule = ecoulePerdu; 

    ctx.font = "30px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("Vous avez perdu avec un score de " + ecoule, 
                 canvas.width / 2 - 110, canvas.height / 2, 220);
    ctx.fillStyle = "cyan"; 
    ctx.fillText("Cliquez sur Jouer.", 
                 canvas.width / 2 - 100, canvas.height / 2 + 30, 200);
}


setInterval(() => {
    if (!window.startBtnAdded) {
        window.startBtnAdded = true;
        const startBtn = document.createElement('button');
        startBtn.textContent = "Jouer";
        startBtn.style.position = "absolute";
        startBtn.style.left = "50%";
        startBtn.style.top = "84%";
        startBtn.style.transform = "translate(-50%)";        
        document.body.appendChild(startBtn);
        
        window.timerStarted = false;
        startBtn.addEventListener('click', () => {
            window.timerStarted = true;
            startTime = Date.now();
            ecoulePerdu = 0;
            resetGame();
        });
    }
    
    canvas.style.backgroundColor = SETTINGS.bgColor;
    
    if (!window.timerStarted) return;
    ctx.fillStyle = SETTINGS.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
        
    if(!gameOver){
        if(!gameOver){
            ecoule = Math.floor((Date.now() - startTime) / 1000);
        scoreAffichage.textContent = "Score : " + ecoule;
        scoreAffichage.style.color = "white";
        scoreAffichage.style.fontSize = "20px";
        scoreAffichage.style.position = "absolute";
        scoreAffichage.style.top = "72.5%";
        scoreAffichage.style.left = "31%";

        movePaddle();
        drawPaddle();
        moveBall();
        drawBall();
    }

    }
    else{
        if (ecoulePerdu === 0) {
            ecoulePerdu = Math.floor((Date.now() - startTime) / 1000);
            if (ecoulePerdu > bestScore) {
            bestScore = ecoulePerdu;
            localStorage.setItem('bestScore', bestScore);
        }
        bestScoreAffichage.textContent = "Meilleur Score : " + bestScore;
        }
        drawGameOver();
    }

}, 20);

bgColorInput.value = SETTINGS.bgColor;
paddleColorInput.value = SETTINGS.paddleColor;
ballColorInput.value = SETTINGS.ballColor;
accelRange.value = SETTINGS.acceleration;
accelNumber.value = SETTINGS.acceleration;
bestScoreAffichage.textContent = "Meilleur Score : " + bestScore;

accelRange.addEventListener('input', () => accelNumber.value = accelRange.value);
accelNumber.addEventListener('input', () => accelRange.value = accelNumber.value);

saveSettingsBtn.addEventListener('click', () => {
    localStorage.setItem('bgColor', bgColorInput.value);
    localStorage.setItem('paddleColor', paddleColorInput.value);
    localStorage.setItem('ballColor', ballColorInput.value);
    localStorage.setItem('acceleration', accelNumber.value);
    alert("Réglages sauvegardés !");
});

resetBestBtn.addEventListener('click', () => {
    bestScore = 0;
    localStorage.setItem('bestScore', bestScore);
    bestScoreAffichage.textContent = "Meilleur (sec) : " + bestScore;
});
