class Paddle extends GameObject {
    constructor(ctx, x) {
        super(ctx, x);

    }
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, canvasHeight - paddleHeight - 10, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();

        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: " + score, 8, 20);

        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("FPS: " + Math.round(fps), 720, 20);
    }
    update(timeStep) {
        if (rightPressed) {
            this.x += 0.08 * timeStep;
        }
        else if (leftPressed) {
            this.x -=  0.08 * timeStep;
        }
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}