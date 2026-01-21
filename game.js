const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');

// 게임 변수
let bird, pipes, score, gravity, gameOver, velocity, gap, pipeSpeed;

function resetGame() {
  bird = { x: 60, y: 300, w: 32, h: 32, vy: 0 };
  pipes = [];
  score = 0;
  gravity = 0.5;
  velocity = -8;
  gap = 150;
  pipeSpeed = 2.5;
  gameOver = false;
  for (let i = 0; i < 3; i++) {
    let px = 400 + i * 200;
    let py = Math.floor(Math.random() * 250) + 100;
    pipes.push({ x: px, y: py });
  }
  scoreDiv.textContent = 'Score: 0';
}

function drawBird() {
  ctx.fillStyle = '#ff0';
  ctx.beginPath();
  ctx.arc(bird.x + bird.w/2, bird.y + bird.h/2, bird.w/2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.stroke();
}

function drawPipes() {
  ctx.fillStyle = '#0f0';
  pipes.forEach(pipe => {
    // 위 파이프
    ctx.fillRect(pipe.x, 0, 60, pipe.y - gap/2);
    // 아래 파이프
    ctx.fillRect(pipe.x, pipe.y + gap/2, 60, 600 - (pipe.y + gap/2));
  });
}

function update() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 새
  bird.vy += gravity;
  bird.y += bird.vy;
  drawBird();
  // 파이프
  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;
    // 점수 체크
    if (!pipe.passed && bird.x > pipe.x + 60) {
      score++;
      pipe.passed = true;
      scoreDiv.textContent = 'Score: ' + score;
    }
    // 파이프 리셋
    if (pipe.x < -60) {
      pipe.x = 400;
      pipe.y = Math.floor(Math.random() * 250) + 100;
      pipe.passed = false;
    }
  });
  drawPipes();
  // 충돌 체크
  pipes.forEach(pipe => {
    if (
      bird.x + bird.w > pipe.x && bird.x < pipe.x + 60 &&
      (bird.y < pipe.y - gap/2 || bird.y + bird.h > pipe.y + gap/2)
    ) {
      gameOver = true;
    }
  });
  // 바닥, 천장 충돌
  if (bird.y < 0 || bird.y + bird.h > 600) {
    gameOver = true;
  }
  if (gameOver) {
    ctx.font = '48px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('Game Over', 70, 300);
    ctx.font = '24px Arial';
    ctx.fillText('스페이스바로 재시작', 90, 340);
  }
}

function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (gameOver) {
      resetGame();
    } else {
      bird.vy = velocity;
    }
  }
});

resetGame();
gameLoop();
