function Player(x, y) {
  this.x = x;
  this.y = y;
  this.dy = 0;
  this.dx = 0;
  this.bulletTracking = [];
  this.ammo = [400, 10, 50];
  this.velocityPercent = 0.2;

  this.fillAmmo = function(type) {
    switch (type) {
      case 0:
        this.ammo[type] = 400;
        break;
      case 1:
        this.ammo[type] = 10;
        break;
      case 2:
        this.ammo[type] = 50;
        break;
    }
  }

  this.img = new Image();
  this.img.src = "data/png/hero.png";

}

/********** Update function for calculations **********/
Player.prototype.update = function() {

  //movement and velocity
  if (this.y > mouse.y) {
    this.dy = Math.abs(this.y - mouse.y) * -this.velocityPercent;
  } else if (this.y < mouse.y) {
    this.dy = Math.abs(this.y - mouse.y) * this.velocityPercent;
  } else if (this.y == mouse.y) {
    this.dy = 0;
  }
  this.y += this.dy;

  if (this.x > mouse.x) {
    this.dx = Math.abs(this.x - mouse.x) * -this.velocityPercent;
  } else if (this.x < mouse.x) {
    this.dx = Math.abs(this.x - mouse.x) * this.velocityPercent;
  } else if (this.x == mouse.x) {
    this.dx = 0;
  }
  this.x += this.dx;

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
      //player.ammo[0]--;
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
        //player.ammo[1]--;
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
      //player.ammo[2]--;
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
  }

  if (this.ammo[1] > 0) {
    this.bulletTracking.push(new PBullet(this.x - 8, this.y - 48, 1));
  }

  if (this.ammo[2] > 0) {
    this.bulletTracking.push(new PBullet(this.x - 44, this.y - 4, 2));
  }

};

/********** Rendering function **********/
Player.prototype.draw = function() {
  c.beginPath();

  ///draw all bullets
  this.bulletTracking.forEach(function(object, index) {
    object.update();
    if (object.y < -100) {
      player.bulletTracking.splice(index, 1);
    }
  });

  //draw ship
  c.drawImage(this.img, this.x - 32, this.y - 32);

  c.closePath();
};