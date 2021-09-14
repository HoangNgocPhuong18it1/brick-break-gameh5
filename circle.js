class Circle extends GameObject {

    constructor(ctx, x, y, radius) {
        super(ctx, x, y, radius);

    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
    }


    update(timeStep) {
        this.x += dx * timeStep;
        this.y += dy * timeStep;
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}