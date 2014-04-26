var Phaser = require('phaser');

var Player = function(game){
    Phaser.Sprite.call(this, game, 0, 0, 'player', 0);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(this.width*0.9, this.height*0.35, 0, this.height*0.2);
    this.scale.x = this.scale.y = this.baseScale = 0.6;
    this.anchor.setTo(0.5, 0.5);

    this.maxSpeed = 5;
    this.acceleration  = 100;
    this.damping = 1.15;

    this.cursors = game.input.keyboard.createCursorKeys();
    this.actionButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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
        this.body.velocity.y += this.acceleration;
    }
    if(this.cursors.up.isDown){
        this.body.velocity.y -= this.acceleration;
    }
    if(this.cursors.right.isDown){
        this.body.velocity.x += this.acceleration;
        this.scale.x = this.baseScale;
    }
    if(this.cursors.left.isDown){
        this.body.velocity.x -= this.acceleration;
        this.scale.x = -this.baseScale;
    }

    this.body.velocity.x /= this.damping;
    this.body.velocity.y /= this.damping;

    if (Math.abs(this.body.velocity.x) < 0.01){
        this.body.velocity.x = 0;
    }

    if (Math.abs(this.body.velocity.y) < 0.01){
        this.body.velocity.y = 0;
    }
};

module.exports = Player;
