import { TweenMax, Back } from 'gsap';
import Utils from './utils';

export default class BezierHandle {
  constructor(x, y, ctx) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.radius = 20;
    this.ctx = ctx;
    this.centerCircleRadius = 0;
  }

  getSides() {
    this.left = this.x - (this.size / 2);
    this.right = this.left + this.size;
    this.top = this.y - (this.size / 2);
    this.bottom = this.top + this.size;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  animate(bool) {
    const percent = {
      val: bool ? 0 : 1
    };
    TweenMax.to(percent, 0.3, {
      val: bool ? 1 : 0,
      onUpdate: () => {
        this.radius = this.size + 5 * percent.val;
        this.centerCircleRadius = percent.val;
      },
      ease: Back.easeOut.config(2)
    });
  }

  draw() {
    this.getSides();
    this.ctx.save();
    this.ctx.fillStyle = '#fff';
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.left + this.size * 0.5,
      this.top + this.size * 0.5,
      this.radius * 0.5,
      0,
      2 * Math.PI,
      false);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();

    this.ctx.save();
    this.ctx.fillStyle = '#4C84D3';
    this.ctx.beginPath();
    this.ctx.arc(this.left + this.size * 0.5,
      this.top + this.size * 0.5,
      Utils.clamp(this.centerCircleRadius * 8, 0, 8),
      0,
      2 * Math.PI,
      false);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  }
}
