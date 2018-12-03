export default class Graph {
  constructor(container, canvas, ctx) {
    this.x = 0;
    this.y = 0;
    this.margin = 100;
    this.height = 0;
    this.width = 0;
    this.percent = 0;
    this.container = container;
    this.canvas = canvas;
    this.ctx = ctx;
    this.resize = this.resize.bind(this);
    this.resize();
  }

  getRandomColor() {
    return '#3498db';
  }

  resize() {
    const bounds = this.container.getBoundingClientRect();
    this.x = this.margin;
    this.y = this.margin;
    this.width = bounds.width - (2 * this.margin);
    this.height = bounds.height - (2 * this.margin);
    this.canvas.width = bounds.width;
    this.canvas.height = bounds.height;
  }

  setPercent(percent) {
    this.percent = percent;
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.save();
    this.ctx.globalAlpha = 0.4;
    this.ctx.fillStyle = this.getRandomColor();
    this.ctx.fillRect(this.x, this.y, this.width * this.percent, this.height);
    this.ctx.restore();
    this.ctx.restore();
  }
}
