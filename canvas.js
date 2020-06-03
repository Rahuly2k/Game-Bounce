let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let paddleWidth = 75;
let paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight;
let ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - (ballRadius + paddleHeight);
let dx = 2;
let dy = -2;
let rightPressed = false;
let leftPressed = false;
let paddleSpeed = 30;

// bricks variables
let bricks = [];
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

// display score

let score = 0;

for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}
/**
 * Display score
 */
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

/**
 * Collision detection
 */
function collisionDetection() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      if (bricks[i][j] && bricks[i][j].status == 1) {
        if (
          x > bricks[i][j].x &&
          x < bricks[i][j].x + brickWidth &&
          y > bricks[i][j].y &&
          y < bricks[i][j].y + brickHeight
        ) {
          dy = -dy;
          //bricks[i][j].status = 0; // we can set the status 0 to remove it from the view
          bricks[i].splice(j, 1);
          score++;
          addBricks();
        }
      }
    }
  }
}

/**
 *  Draw a paddle and position it to the center
 */

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
drawPaddle();

/**
 * Draw a playing ball
 */
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
}
drawBall();

/**
 * Ball animation
 */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear rect form canvas

  drawScore();
  collisionDetection();
  drawBricks();
  drawBall();
  drawPaddle();

  // Bounce the ball to the opposite direction

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy == canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      if ((y = y - paddleHeight)) {
        dy = -dy;        
      }
    } else {
        alert( "Game Over !! Your Score is " + score);
        document.location.reload();
        clearInterval(interval)
    }
  }

  x += dx;
  y += dy;
}

var interval = setInterval(draw, 10);

document.addEventListener("keydown", keyDownHandller);
document.addEventListener("keyup", keyUpHandller);
document.addEventListener("mousemove", mouseMoveHandler, false);

/**
 * Handle the arrow key event to move paddle left or right
 * @param {*} e
 */
function keyDownHandller(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
    x += 2; // slightly change the x axis 
    y += 2; // slightly change the y axis
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed;
  }
  if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }
}

function keyUpHandller(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }    
}

/**
 * function for create bricks
 */
function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r] && bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

drawBricks();

function addBricks() {
  for (let b = 0; b < brickColumnCount; b++) {
    if (bricks[b]) {
      let count = 0;
      for (let e of bricks[b]) {
        if (!e) {
          count++;
        }
      }
      if (count == bricks[b].length) {
        bricks[b] = new Array(brickRowCount);
        let index = Math.floor(Math.random() * brickRowCount);
        let xb = brickOffsetLeft + (paddleWidth + brickPadding) * index;
        let yb = brickOffsetLeft + brickOffsetLeft * index;
        bricks[b][index] = { x: xb, y: yb, status: 1 };        
      }
    }
  }
}
