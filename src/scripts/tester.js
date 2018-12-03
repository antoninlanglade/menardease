export default class Tester {
  constructor(canvas, ctx) {
    this.x = 0;
    this.y = 0;
    this.radius = 15;
    this.canvas = canvas;
    this.ctx = ctx;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(
      this.x,
      this.y,
      this.radius,
      0,
      2 * Math.PI,
      false);

    this.ctx.fillStyle = '#bbb';
    this.ctx.fill();
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.restore();
  }
}
