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

/////////////////////////////////////   PLAYER   /////////////////////////////////////

function Player(x, y) {
  this.x = x;
  this.y = y;
  this.dy = 0;
  this.dx = 0;
  this.bulletTracking = [];
  this.ammo = [1, 1, 1];
}

/********** Update function for calculations **********/
Player.prototype.update = function() {
  let velocityPercent = 0.2;

  //movement and velocity
  if (this.y > mouse.y) {
    this.dy = Math.abs(this.y - mouse.y) * -velocityPercent;
  } else if (this.y < mouse.y) {
    this.dy = Math.abs(this.y - mouse.y) * velocityPercent;
  } else if (this.y == mouse.y) {
    this.dy = 0;
  }
  this.y += this.dy;

  if (this.x > mouse.x) {
    this.dx = Math.abs(this.x - mouse.x) * -velocityPercent;
  } else if (this.x < mouse.x) {
    this.dx = Math.abs(this.x - mouse.x) * velocityPercent;
  } else if (this.x == mouse.x) {
    this.dx = 0;
  }
  this.x += this.dx;
  this.img = new Image();
  this.img.src = "data/png/hero.png";

  this.draw();
};

function PBullet(x, y, type) {
  this.x = x;
  this.y = y;
  this.dy = 20;
  this.image = new Image();
  this.flash = new Image();
  this.new = true;

  this.update = function() {
    this.draw();
    this.y -= this.dy;
  };

  this.draw = function() {

    c.beginPath();
    c.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    c.closePath();

    if (this.new) {
      c.beginPath();
      c.drawImage(this.flash, this.x + this.flashXoff - 7, this.y + this.flashYoff - 15, 30, 30);
      c.closePath();
      this.new = false;
    }

  };

  switch (type) {
    case 0:
      this.image.src =
        "data/png/heroAmmo00.png";
      this.flash.src =
        "data/png/heroAmmoFlash00.png";
      this.flashXoff = -4;
      this.flashYoff = 2;
      break;
    case 1:
      this.image.src =
        "data/png/heroAmmo01.png";
      this.image.width = 16;
      this.image.height = 32;
      this.flash.src =
        "data/png/heroAmmoFlash01.png";
      this.flashXoff = 0;
      this.flashYoff = 4;
      if (greenBulletCounter < 0) {
        greenBulletCounter = 5;
      } else {
        this.y = -100;
        this.x = -100;
        greenBulletCounter--;
      }
      this.dy = 10;
      break;
    case 2:
      this.image.src =
        "data/png/heroAmmo02.png";
      this.image.width = 16;
      this.image.height = 32;
      this.flash.src =
        "data/png/heroAmmoFlash02.png";
      if (purpleBulletCounter >= 1) {
        purpleBulletCounter = 0;
        this.x += 38 * 2;
      } else {
        purpleBulletCounter++;
      }
      this.dy = 25;
      break;
  }

}

/********** Shooting (while mousedown) **********/
Player.prototype.shoot = function() {

  this.bulletTracking.push(new PBullet(this.x + 9, this.y - 24, 0));
  this.bulletTracking.push(new PBullet(this.x - 17, this.y - 24, 0));

  if (this.ammo[0] > 0) {
    this.bulletTracking.push(new PBullet(this.x + 18, this.y - 8, 0));
    this.bulletTracking.push(new PBullet(this.x - 26, this.y - 8, 0));
    //this.ammo[0]--;
  }

  if (this.ammo[1] > 0) {
    this.bulletTracking.push(new PBullet(this.x - 8, this.y - 48, 1));
    //this.ammo[1]--;
  }

  if (this.ammo[2] > 0) {
    this.bulletTracking.push(new PBullet(this.x - 44, this.y - 4, 2));
    //this.ammo[2]--;
  }

};

/********** Rendering function **********/
Player.prototype.draw = function() {
  c.beginPath();

  ///draw all bullets
  this.bulletTracking.forEach(object => {
    object.update();
  });

  //draw ship
  c.drawImage(this.img, this.x - 32, this.y - 32);

  c.closePath();
};

/////////////////////////////////////END PLAYER/////////////////////////////////

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