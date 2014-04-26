var Phaser = require('phaser');

var Player = function(game){
    Phaser.Sprite.call(this, game, 0, 0, 'player', 0);
    this.scale.x = this.scale.y = this.baseScale = 0.6;
    this.anchor.setTo(0.5, 0.5);

    this.maxSpeed = 5;
    this.acceleration  = 1.5;
    this.damping = 1.2;

    this.speed = {x: 0, y: 0};

    this.cursors = game.input.keyboard.createCursorKeys();
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.setPosition = function(x, y){
    this.x = x;
    this.y = y;
};

Player.prototype.update = function(){
    this.updateSpeed();
};

Player.prototype.updateSpeed = function(){
    if(this.cursors.down.isDown){
        this.speed.y += this.acceleration;
    }
    if(this.cursors.up.isDown){
        this.speed.y -= this.acceleration;
    }
    if(this.cursors.right.isDown){
        this.speed.x += this.acceleration;
        this.scale.x = this.baseScale;
    }
    if(this.cursors.left.isDown){
        this.speed.x -= this.acceleration;
        this.scale.x = -this.baseScale;
    }

    this.x += this.speed.x;
    this.y += this.speed.y;

    this.speed.x /= this.damping;
    this.speed.y /= this.damping;

    if (Math.abs(this.speed.x) < 0.01){
        this.speed.x = 0;
    }

    if (Math.abs(this.speed.y) < 0.01){
        this.speed.y = 0;
    }
};

module.exports = Player;
