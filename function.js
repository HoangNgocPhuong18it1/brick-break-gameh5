const canvasWidth =800;
const canvasHeight = 500;
let canvas;
let ctx;

let ball;
let paddleHeight = 15;
let paddleWidth = 75;
let paddleX = (canvasWidth-paddleWidth) / 2;
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
let brickX ;
let brickY ;
let groubBrick ;

var dx = 2;
var dy = -2;

let active;

var score = 0;
window.onload = init;

function init(){
    active = true
    // Get a reference to the canvas
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1};
        }
    }

    // createBrick();
    groubBrick = new Bricks();
    ball = new Circle(ctx,500, 450,10);
    paddle= new Paddle(ctx,paddleX);
    
    window.requestAnimationFrame(gameLoop);
    
}
// function createBrick() {
//     for(var c=0; c<brickColumnCount; c++) {
//         for(var r=0; r<brickRowCount; r++) {
//             brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
//             brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
//             bricks[c][r].x = brickX;
//             bricks[c][r].y = brickY;
//             bricks[c][r].status =1;
//             groubBrick.unshift( new Bricks(ctx, bricks[c][r].x, bricks[c][r].y,0 , bricks[c][r].status));
            
//         }
//     }
//     console.log(groubBrick)
// }

function gameLoop(timeStamp)
{   
    if(active){
        
        // for (let i = 0; i < groubBrick.length; i++) {
        //     groubBrick[i].update();
        // }
        // groubBrick.update
        
        ball.update();
        paddle.update();

        detectEdgeCollisions();

        // for (let i = 0; i < groubBrick.length; i++) {
        //     groubBrick[i].clearCanvas();
        // }
        groubBrick.clearCanvas
        ball.clearCanvas();
        paddle.clearCanvas();


        // for (let i = 0; i < groubBrick.length; i++) {
        //     groubBrick[i].draw();
        // }
        groubBrick.draw();
        paddle.draw();
        ball.draw();
        

        window.requestAnimationFrame(gameLoop);
    }
}
class GameObject
{
    constructor (ctx, x, y, radius, status){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.status = status;
        this.radius = radius;
        
    }
}
class Circle extends GameObject
{   

    constructor (ctx, x, y,radius){
        super(ctx, x, y, radius);
      
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
    }
   

    update(){
        this.x += dx;
        this.y += dy;
    }
    clearCanvas(){
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
class Paddle extends GameObject{
    constructor(ctx,x) {
        super(ctx,x);
        
    }
    draw(){
        ctx.beginPath();
        ctx.rect(this.x, canvasHeight-paddleHeight -10, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();

        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: "+score, 8, 20);
    }
    update(){
        if(rightPressed) {
            this.x += 7;
        }
        else if(leftPressed) {
            this.x -= 7;          
        }
    }
    clearCanvas(){
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
class Bricks extends GameObject{
    constructor() {
        super();
        
    }
    draw(){    
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
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
    // update(){
        
    // }
    clearCanvas(){
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function detectEdgeCollisions()
{   // check left right
    if (ball.x +dx< ball.radius || ball.x +dx > canvasWidth-ball.radius){
        dx = -dx;
    }
    // check top bottom
    if (ball.y + dy < ball.radius){
        dy = -dy;
    }else if (ball.y + dy > canvasHeight-ball.radius -10) {
        if(ball.x > paddle.x && ball.x < paddle.x + paddleWidth) {
            dy = -dy;
        }else {
            alert("GAME OVER");
            ctx.beginPath();      
            active = false;
            location.reload();
            // clearInterval(interval);
        }
    }

    // check paddle
    if (paddle.x + paddleWidth > canvasWidth){
        paddle.x = canvasWidth - paddleWidth;
    }
    if (paddle.x < 0){
        paddle.x = 0;
    }
    
    // check brick
    for(var c=0; c< brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(ball.x > b.x && ball.x < b.x+ brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
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
    if(relativeX > 0 && relativeX < canvas.width) {
        paddle.x= relativeX - paddleWidth/2;
    }
}
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}