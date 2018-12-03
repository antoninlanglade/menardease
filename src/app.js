import BezierHandle from './scripts/bezier';
import Graph from './scripts/graph';
import Tester from './scripts/tester';
import Utils from './scripts/utils';
import RAF from 'raf';
import BezierEasing from 'bezier-easing';
import { TweenMax, Linear } from 'gsap';

let timeValue;
let drag = false;
let draggingObj;
let current;
let curLeft;
let curRight;
let curTop;
let curBottom;
let x1;
let y1;
let x2;
let y2;

function onPress(event) {
  event.preventDefault();
  drag = true;

  const mousePos = Utils.getPos(event, canvas);
  const x = mousePos.x;
  const y = mousePos.y;

  draggingObj = null;

  for (let i = 0; i < handles.length; i++) {
    current = handles[i];
    curLeft = current.left;
    curRight = current.right;
    curTop = current.top;
    curBottom = current.bottom;

    if (x >= curLeft && x <= curRight && y >= curTop && y <= curBottom) {
      draggingObj = current;
      draggingObj && draggingObj.animate(true);
      document.body.classList.add('grabbable');
      document.body.classList.add('grab');
    }
  }
}

function onMove(event) {
  event.preventDefault();
  const mousePos = Utils.getPos(event, canvas);
  let item = false;
  for (let i = 0; i < handles.length; i++) {
    current = handles[i];
    curLeft = current.left;
    curRight = current.right;
    curTop = current.top;
    curBottom = current.bottom;

    if (mousePos.x >= curLeft &&
        mousePos.x <= curRight &&
        mousePos.y >= curTop &&
        mousePos.y <= curBottom) {
      document.body.classList.add('grabbable');
      item |= true;
    }
  }
  if (!item) {
    document.body.classList.remove('grabbable');
  }

  if (!drag || !draggingObj) return;

  let x = mousePos.x;
  let y = mousePos.y;

  if (x > graph.margin + graph.width) {
    x = graph.margin + graph.width;
  }
  if (x < graph.margin) {
    x = graph.margin;
  }
  if (y > canvas.height) {
    y = canvas.height;
  }
  if (y < 0) {
    y = 0;
  }

  draggingObj.x = x;
  draggingObj.y = y;
}

function onRelease(event) {
  event.preventDefault();
  draggingObj && draggingObj.animate(false);
  drag = false;
  document.body.classList.remove('grab');
  copyToClipboard();
}

function copyToClipboard() {
  if (window.global && window.global.clipboard) {
    window.global.clipboard.writeText(`(${x1}, ${y1}, ${x2}, ${y2})`);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  graph.draw();

  const cp1 = firstBezier;
  const cp2 = secondBezier;

  ctx.save();
  ctx.strokeStyle = '#4C84D3';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(graph.x, graph.y + graph.height);

  ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, graph.x + graph.width, graph.y);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.setLineDash([1, 2]);
  ctx.strokeStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(graph.x, graph.y + graph.height);
  ctx.lineTo(cp1.x, cp1.y);
  ctx.moveTo(graph.x + graph.width, graph.y);
  ctx.lineTo(cp2.x, cp2.y);
  ctx.stroke();
  ctx.restore();

  tester.draw();

  for (let i = 0; i < handles.length; i++) {
    handles[i].draw();
  }

  x1 = ((-graph.x + cp1.x) / graph.width).toFixed(3);
  y1 = ((graph.height + graph.y - cp1.y) / graph.height).toFixed(3);
  x2 = ((-graph.x + cp2.x) / graph.width).toFixed(3);
  y2 = ((graph.height + graph.y - cp2.y) / graph.height).toFixed(3);
}


function presetChange() {
  const coordinates = $presets.value.split(',');

  firstBezier.setPosition(
    graph.margin + coordinates[0] * graph.width,
    graph.y + graph.height - (coordinates[1] * graph.height)
  );

  secondBezier.setPosition(
    graph.margin + coordinates[2] * graph.width,
    graph.y + graph.height - (coordinates[3] * graph.height)
  );

  copyToClipboard();
}

function resize() {
  graph.resize();
  tester.setPosition(graph.margin, graph.height + graph.margin);
  presetChange();
}

function timeChange(e) {
  timeValue = e.currentTarget.value;
  $timeText.innerHTML = timeValue;
}

function animateTester(direction) {
  const percent = { val: direction === 1 ? 0 : 1 };
  const startPoint = { x: graph.margin, y: graph.height + graph.margin };
  const endPoint = { x: graph.margin + graph.width, y: graph.margin };
  const ease = BezierEasing(x1, y1, x2, y2);

  TweenMax.to(percent, timeValue / 1000, {
    val: direction === 1 ? 1 : 0,
    ease: Linear.easeNone,
    onUpdate: () => {
      const point = Utils.getCubicBezierXYatPercent(
        startPoint,
        firstBezier,
        secondBezier,
        endPoint,
        ease(percent.val)
      );
      graph.setPercent(ease(percent.val));
      tester.setPosition(point.x, point.y);
    }
  });
}

// DOM
const graphContainer = document.getElementsByClassName('graph')[0];
const $presets = document.getElementById('presets');
const $start = document.getElementById('start');
const $reverse = document.getElementById('reverse');
const $time = document.getElementById('time');
const $timeText = document.getElementsByClassName('time')[0];
const canvas = document.getElementById('curve');
const ctx = canvas.getContext('2d');

// Classes
const firstBezier = new BezierHandle(0, 0, ctx);
const secondBezier = new BezierHandle(0, 0, ctx);
const handles = [firstBezier, secondBezier];
const tester = new Tester(canvas, ctx);
const graph = new Graph(graphContainer, canvas, ctx);
timeValue = $time.value;

// Listeners
$presets.addEventListener('change', presetChange);
canvas.addEventListener('mousedown', onPress, false);
canvas.addEventListener('mousemove', onMove, false);
canvas.addEventListener('mouseup', onRelease, false);
$start.addEventListener('click', () => animateTester(1), false);
$reverse.addEventListener('click', () => animateTester(-1), false);
$time.addEventListener('change', timeChange, false);
window.addEventListener('resize', resize);

// Setup
RAF.add(draw);
tester.setPosition(0, graph.height + graph.margin);
resize();
