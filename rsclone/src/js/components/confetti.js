// source https://codepen.io/linrock/pen/Amdhr
function range(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

const drawCircle = function(context, x, y, r, style) {
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fillStyle = style;
  context.fill();
};

class Confetti {
  constructor(context) {
    this.colors = [[85, 71, 106], [174, 61, 99], [219, 56, 83], [244, 92, 68], [248, 182, 70]];
    this.style = this.colors[range(0, 4)];
    this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
    this.r = range(2, 6);
    this.r2 = 2 * this.r;
    this.replace();
    this.context = context;
  }

  replace() {
    this.opacity = 0;
    this.dop = 0.03 * range(1, 4);
    this.x = range(-this.r2, window.w - this.r2);
    this.y = range(-20, window.h - this.r2);
    this.xmax = window.w - this.r;
    this.ymax = window.h - this.r;
    this.vx = (range(0, 2) + (8 * window.xpos)) - 5;
    this.vy = (0.7 * this.r) + range(-1, 1);
  }

  draw() {
    this.x += this.vx;
    this.y += this.vy;
    this.opacity += this.dop;
    if (this.opacity > 1) {
      this.opacity = 1;
      this.dop *= -1;
    }
    if ((this.opacity < 0) || (this.y > this.ymax)) { this.replace(); }
    if (!(this.x > 0 && this.x < this.xmax)) {
      this.x = (this.x + this.xmax) % this.xmax;
    }
    drawCircle(this.context, this.x, this.y, this.r, `${this.rgb},${this.opacity})`);
  }
}
export default function addConfetti() {
  const NUM_CONFETTI = 350;
  const canvas = document.getElementById('confetti');
  const context = canvas.getContext('2d');
  window.w = 0;
  window.h = 0;

  const resizeWindow = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.w = canvas.width;
    window.h = canvas.height;
  };

  window.addEventListener('resize', resizeWindow, false);

  window.onload = () => setTimeout(resizeWindow, 0);

  window.xpos = 0.5;

  document.onmousemove = (e) => { window.xpos = e.pageX / window.w; };

  window.requestAnimationFrame = ((() => window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.oRequestAnimationFrame
  || window.msRequestAnimationFrame
  || ((callback) => window.setTimeout(callback, 1000 / 60))))();

  const confetti = [];
  for (let i = 0; i < NUM_CONFETTI; i += 1) {
    confetti.push(new Confetti(context));
  }

  window.step = function() {
    requestAnimationFrame(window.step);
    context.clearRect(0, 0, window.w, window.h);
    return Array.from(confetti).map((c) => c.draw());
  };

  window.step();
  resizeWindow();
}
