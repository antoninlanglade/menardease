export default class Utils {
  static getCubicBezierXYatPercent(startPt, controlPt1, controlPt2, endPt, percent) {
    const x = Utils.CubicN(percent, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
    const y = Utils.CubicN(percent, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
    return ({
      x,
      y
    });
  }

  static CubicN(pct, a, b, c, d) {
    const t2 = pct * pct;
    const t3 = t2 * pct;
    return a +
      (-a * 3 + pct * (3 * a - a * pct)) * pct +
      (3 * b + pct * (-6 * b + b * 3 * pct)) * pct +
      (c * 3 - c * 3 * pct) * t2 + d * t3;
  }

  static getPos(event, container) {
    const bounds = container.getBoundingClientRect();
    return {
      x: event.pageX - bounds.left,
      y: event.pageY - bounds.top
    };
  }

  static getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
    const x = (1 - percent * percent) * startPt.x + 2 *
                (1 - percent) * percent * controlPt.x
                + (percent * percent) * endPt.x;
    const y = (1 - percent * percent) * startPt.y + 2 *
                (1 - percent) * percent * controlPt.y +
                (percent * percent) * endPt.y;
    return ({
      x,
      y
    });
  }
  static clamp(value, min, max) {
    if (value < min) {
      return min;
    } else if (value > max) {
      return max;
    }
    return value;
  }

  static map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }

  static lerp(value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
  }
  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
