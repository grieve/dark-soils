var Phaser = require('phaser');

var Player = function(game){
    this.sprite = new Phaser.Sprite(game, 0, 0, 'player', 0);
    this.scale = 0.6;
    this.sprite.scale.x = this.sprite.scale.y = this.scale;
    this.sprite.anchor.setTo(0.5, 0.5);

    this.maxSpeed = 5;
    this.acceleration  = 1.5;
    this.damping = 1.2;

    this.speed = {x: 0, y: 0};

    this.cursors = game.input.keyboard.createCursorKeys();
};

Player.prototype.update = function(){
    if(this.cursors.down.isDown){
        this.speed.y += this.acceleration;
    }
    if(this.cursors.up.isDown){
        this.speed.y -= this.acceleration;
    }
    if(this.cursors.right.isDown){
        this.speed.x += this.acceleration;
        this.sprite.scale.x = this.scale;
    }
    if(this.cursors.left.isDown){
        this.speed.x -= this.acceleration;
        this.sprite.scale.x = -this.scale;
    }

    this.sprite.x += this.speed.x;
    this.sprite.y += this.speed.y;

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
