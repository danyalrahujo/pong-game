const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 6;
const ballSpeed = 5;
const paddleSpeed = 6;

let playerScore = 0;
let computerScore = 0;
let gameOver = false;
let winningScore = 5;

// Player paddle
const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: paddleSpeed
};

// Computer paddle
const computer = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: paddleSpeed * 0.8
};

// Ball
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    dx: ballSpeed,
    dy: ballSpeed
};

// Keyboard input
const keys = {
    ArrowUp: false,
    ArrowDown: false
};

// Mouse tracking
let mouseY = canvas.height / 2;

// Event listeners
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = true;
    if (e.key === 'ArrowDown') keys.ArrowDown = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = false;
    if (e.key === 'ArrowDown') keys.ArrowDown = false;
});

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update player paddle
function updatePlayer() {
    // Keyboard control
    if (keys.ArrowUp && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }

    // Mouse control
    const targetY = mouseY - player.height / 2;
    if (targetY > 0 && targetY < canvas.height - player.height) {
        player.y = targetY;
    }
}

// Update computer paddle (AI)
function updateComputer() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;

    if (computerCenter < ballCenter - 35) {
        if (computer.y < canvas.height - computer.height) {
            computer.y += computer.speed;
        }
    } else if (computerCenter > ballCenter + 35) {
        if (computer.y > 0) {
            computer.y -= computer.speed;
        }
    }
}

// Update ball
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top and bottom)
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.size < 0 ? ball.size : canvas.height - ball.size;
    }

    // Player paddle collision
    if (
        ball.x - ball.size < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.size;
        // Add spin based on where ball hits paddle
        ball.dy += (ball.y - (player.y + player.height / 2)) * 0.1;
    }

    // Computer paddle collision
    if (
        ball.x + ball.size > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computer.x - ball.size;
        // Add spin based on where ball hits paddle
        ball.dy += (ball.y - (computer.y + computer.height / 2)) * 0.1;
    }

    // Out of bounds (score points)
    if (ball.x - ball.size < 0) {
        computerScore++;
        resetBall();
    } else if (ball.x + ball.size > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Check for winner
    if (playerScore >= winningScore || computerScore >= winningScore) {
        gameOver = true;
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
}

// Draw paddle
function drawPaddle(paddle) {
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
    ctx.fillStyle = '#ff0055';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
}

// Draw center line
function drawCenterLine() {
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Draw all game elements
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    drawCenterLine();

    // Draw paddles and ball
    drawPaddle(player);
    drawPaddle(computer);
    drawBall();

    // Draw game over message
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        
        const winner = playerScore >= winningScore ? 'YOU WIN!' : 'COMPUTER WINS!';
        ctx.fillText(winner, canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = '20px Arial';
        ctx.fillStyle = '#ccc';
        ctx.fillText('Refresh the page to play again', canvas.width / 2, canvas.height / 2 + 30);
    }
}

// Update score display
function updateScore() {
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

// Game loop
function gameLoop() {
    if (!gameOver) {
        updatePlayer();
        updateComputer();
        updateBall();
    }

    updateScore();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
