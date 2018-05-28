"use strict";

// Initial Setup
var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
var mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

var player = new Player(mouse.x, mouse.y);

// Event Listeners
addEventListener("mousemove", function(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("touchmove", function(event) {
  mouse.x = event.touches[0].clientX;
  mouse.y = event.touches[0].clientY;
});

addEventListener("resize", function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

//these counters are for bullet spacing and positioning
let greenBulletCounter = 0;
let purpleBulletCounter = 0;
let shooting;
addEventListener("mousedown", function() {
  greenBulletCounter = 0;
  player.shoot();
  shooting = setInterval(function() {
    player.shoot();
  }, 50);
});

addEventListener("mouseup", function() {
  clearInterval(shooting);
});

addEventListener("touchstart", function() {
  player.shoot();
  shooting = setInterval(function() {
    player.shoot();
  }, 50);
});

addEventListener("touchend", function() {
  clearInterval(shooting);
});

// Utility Functions
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  var xDist = x2 - x1;
  var yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}


// Implementation
var render = void 0;

function init() {
  render = [];

  render.push(player);
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  render.forEach(object => {
    object.update();
  });
}

init();
animate();