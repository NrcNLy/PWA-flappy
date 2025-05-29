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
    // Calculate available space based on CSS max-width/max-height and window size
    let containerWidth = canvas.parentElement.clientWidth * 0.95;
    let containerHeight = window.innerHeight * 0.85; // Leave v-space for other UI

    let newWidth = containerWidth;
    let newHeight = containerHeight;

    // Adjust to maintain aspect ratio within the available space
    if (newWidth / newHeight > aspectRatio) { // Container is wider than aspect ratio allows
        newWidth = newHeight * aspectRatio;
    } else { // Container is taller than aspect ratio allows
        newHeight = newWidth / aspectRatio;
    }

    const maxWidth = 700; // Absolute max game width
    const maxHeight = maxWidth / aspectRatio;

    canvas.width = Math.min(newWidth, maxWidth);
    canvas.height = Math.min(newHeight, maxHeight);
}

function setup() {
    resizeCanvas(); // Set canvas drawing buffer size
    bird = {
        x: 50,
        y: canvas.height / 2 - birdHeight / 2, // Position bird in the new center
        width: birdWidth,
        height: birdHeight,
        velocity: 0
    };
    pipes = [];
    // Score, gameOver, gameStarted are reset here. They will be restored by the resize handler if needed.
    score = 0;
    frames = 0;
    gameOver = false;
    gameStarted = false;

    scoreBoard.textContent = "Score: 0";
    restartButton.style.display = 'none';
    instructionsDiv.style.display = 'block';
    instructionsDiv.textContent = "Tap screen or Press Space to Flap!";

    // Ensure game loop is started if not already running (relevant for initial setup)
    if (!gameLoopId) {
        gameLoop();
    }
}

function drawBird() {
    ctx.fillStyle = birdColor;
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = '#2e8b57'; // Sea green for pipes
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.topHeight + pipe.gap, pipe.width, canvas.height - (pipe.topHeight + pipe.gap));
    });
}

function updateBird() {
    if (!gameStarted || gameOver) return; // Bird only moves if game started and not over

    bird.velocity += gravity;
    bird.y += bird.velocity;

    // Collision with top/bottom
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        // Keep bird within bounds slightly before calling endGame to prevent it visually going too far
        bird.y = Math.max(0, Math.min(bird.y, canvas.height - bird.height));
        bird.velocity = 0;
        endGame();
    }
}

function updatePipes() {
    if (!gameStarted || gameOver) return; // Pipes only move if game started and not over

    if (frames % pipeSpawnInterval === 0) {
        let minPipeHeight = 50; // Minimum height for the top part of the pipe
        let maxPipeHeight = canvas.height - pipeGap - minPipeHeight; // Max height for top pipe ensuring gap and bottom pipe space
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

        // Collision detection
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > pipe.topHeight + pipe.gap)
        ) {
            endGame();
        }

        // Score
        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            score++;
            pipe.passed = true;
            scoreBoard.textContent = "Score: " + score;
        }
    });

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function flap() {
    if (gameOver) return; // Don't flap if game is over
    if (!gameStarted) {
        gameStarted = true;
        instructionsDiv.style.display = 'none';
    }
    bird.velocity = lift;
}
