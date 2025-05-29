// game-script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('scoreBoard');
const restartButton = document.getElementById('restartButton');
const instructionsDiv = document.getElementById('instructions');

// Game variables
let bird, pipes, score, gameOver, gameStarted;
let gravity = 0.3;
let lift = -7;
let pipeWidth = 60;
let pipeGap = 150;
let pipeSpeed = 2.5;
let pipeSpawnInterval = 120; // Frames between pipe spawns
let frames = 0;

// Bird properties
const birdWidth = 30;
const birdHeight = 30;
const birdColor = 'yellow'; // Color for the bird shape

// Function to resize the canvas drawing buffer and maintain aspect ratio
function resizeCanvas() {
    const aspectRatio = 16 / 9;
    let containerWidth = canvas.parentElement ? canvas.parentElement.clientWidth * 0.95 : window.innerWidth * 0.9;
    let containerHeight = window.innerHeight * 0.85;

    let newWidth = containerWidth;
    let newHeight = containerHeight;

    if (newWidth / newHeight > aspectRatio) {
        newWidth = newHeight * aspectRatio;
    } else {
        newHeight = newWidth / aspectRatio;
    }

    const maxWidth = 700;
    const maxHeight = maxWidth / aspectRatio;

    canvas.width = Math.min(newWidth, maxWidth);
    canvas.height = Math.min(newHeight, maxHeight);
}

function setup() {
    resizeCanvas();
    bird = {
        x: 50,
        y: canvas.height / 2 - birdHeight / 2,
        width: birdWidth,
        height: birdHeight,
        velocity: 0
    };
    pipes = [];
    score = 0;
    frames = 0;
    gameOver = false;
    gameStarted = false;

    scoreBoard.textContent = "Score: 0";
    restartButton.style.display = 'none';
    instructionsDiv.style.display = 'block';
    instructionsDiv.textContent = "Tap screen or Press Space to Flap!";

    if (!gameLoopId) {
        gameLoop();
    }
}

function drawBird() {
    if (!bird) return;
    ctx.fillStyle = birdColor;
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = '#2e8b57';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.topHeight + pipe.gap, pipe.width, canvas.height - (pipe.topHeight + pipe.gap));
    });
}

function updateBird() {
    if (!bird || !gameStarted || gameOver) return;

    bird.velocity += gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        bird.y = Math.max(0, Math.min(bird.y, canvas.height - bird.height));
        bird.velocity = 0;
        endGame();
    }
}

function updatePipes() {
    if (!gameStarted || gameOver) return;

    if (frames % pipeSpawnInterval === 0) {
        let minPipeHeight = 50;
        let maxPipeHeight = canvas.height - pipeGap - minPipeHeight;
        if (maxPipeHeight < minPipeHeight) maxPipeHeight = minPipeHeight;
        let topHeight = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight;

        pipes.push({
            x: canvas.width,
            width: pipeWidth,
            topHeight: topHeight,
            gap: pipeGap,
            passed: false
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        if ( bird &&
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > pipe.topHeight + pipe.gap)
        ) {
            endGame();
        }

        if (!pipe.passed && pipe.x + pipe.width < (bird ? bird.x : 0) ) {
            score++;
            pipe.passed = true;
            scoreBoard.textContent = "Score: " + score;
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function flap() {
    if (gameOver || !bird) return;
    if (!gameStarted) {
        gameStarted = true;
        instructionsDiv.style.display = 'none';
    }
    bird.velocity = lift;
}

function endGame() {
    if (gameOver) return;
    gameOver = true;
    restartButton.style.display = 'block';
    instructionsDiv.textContent = "Game Over! Tap Restart.";
    instructionsDiv.style.display = 'block';
}

let gameLoopId = null;
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateBird();
    updatePipes();

    drawPipes();
    drawBird();

    if (gameStarted && !gameOver) {
         frames++;
    }
    gameLoopId = requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        flap();
    }
});
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    flap();
});
 canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    flap();
});

restartButton.addEventListener('click', () => {
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
    setup();
});

window.addEventListener('resize', () => {
    const currentScore = score;
    const birdX = bird ? bird.x : 50;
    const wasGameOver = gameOver;
    const wasGameStarted = gameStarted;

    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
    
    setup(); // Calls resizeCanvas internally and starts new loop

    score = currentScore;
    scoreBoard.textContent = "Score: " + score;

    if (bird) {
        bird.x = birdX;
    }

    gameStarted = wasGameStarted;

    if (wasGameOver) {
        endGame();
    } else if (wasGameStarted) {
        instructionsDiv.style.display = 'none';
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPipes();
    drawBird();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
            gameLoopId = null;
            console.log("Game paused due to page visibility.");
        }
    } else {
        if (!gameLoopId && gameStarted && !gameOver) {
            console.log("Game resumed due to page visibility.");
            gameLoop();
        }
    }
});

setup(); // Initial setup
