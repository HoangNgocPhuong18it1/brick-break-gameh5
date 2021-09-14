const canvasWidth = 800;
const canvasHeight = 500;
let canvas;
let ctx;


let ball;
let paddleHeight = 15;
let paddleWidth = 75;
let paddleX = (canvasWidth - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 9;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
let brickX;
let brickY;
let groubBrick;

let paddle;

var dx = 0.08;
var dy = -0.08;

let secondsPassed = 0;
let oldTimeStamp = 0;

let lastFrameTimeMs =  0 ,  
    maxFPS =  75 ; 
var fps =  60 , 
    framesThisSecond =  0 , 
    lastFpsUpdate =  0 ; 

    
let timestep =  1000/60 ; 
let delta =0;

let active;




var score = 0;
window.onload = init;

function init() {
    active = true
    // Get a reference to the canvas
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    // createBrick();
    groubBrick = new Bricks();
    ball = new Circle(ctx, 500, 450, 10);
    paddle = new Paddle(ctx, paddleX);

    window.requestAnimationFrame(gameLoop);

}

function gameLoop(timeStamp) {
    if (active) {

        if (timeStamp < lastFrameTimeMs + (1000 / maxFPS)) {
            requestAnimationFrame(gameLoop);
            return;
        }
        delta +=  timeStamp - lastFrameTimeMs ;  // note + = here 
        lastFrameTimeMs = timeStamp ; 
        // console.log(delta , timestep)
        var numUpdateSteps = 0;
        while( delta >= timestep )  {
            ball.update(timestep);
            paddle.update(timestep);
            delta -= timestep ; 
            if (++numUpdateSteps >= 240) {
                panic();
                break;
            }
        } 
    
        if (timeStamp > lastFpsUpdate + 1000) { 
            fps = 0.25 * framesThisSecond + (1 - 0.25) * fps; 
     
            lastFpsUpdate = timeStamp;
            framesThisSecond = 0;
        }
        framesThisSecond++;

        detectEdgeCollisions();

        groubBrick.clearCanvas
        ball.clearCanvas();
        paddle.clearCanvas();

        groubBrick.draw();
        paddle.draw();
        ball.draw();


        window.requestAnimationFrame(gameLoop);
    }
}
function panic() {
    delta = 0;
}

function detectEdgeCollisions() {   // check left right
    if (ball.x + dx < ball.radius || ball.x + dx > canvasWidth - ball.radius) {
        dx = -dx;
    }
    // check top bottom
    if (ball.y + dy < ball.radius) {
        dy = -dy;
    } else if (ball.y + dy > canvasHeight - ball.radius - 10) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddleWidth) {
            dy = -dy;
        } else {
            alert("GAME OVER");
            ctx.beginPath();
            active = false;
            location.reload();
            // clearInterval(interval);
        }
    }

    // check paddle
    if (paddle.x + paddleWidth > canvasWidth) {
        paddle.x = canvasWidth - paddleWidth;
    }
    if (paddle.x < 0) {
        paddle.x = 0;
    }

    // check brick
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN!");
                        location.reload();
                        // Needed for Chrome to end game
                    }
                }
            }
        }
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddleWidth / 2;
    }
}
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}