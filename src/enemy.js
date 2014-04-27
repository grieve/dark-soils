var Phaser = require('phaser');

var Enemy = function(game){
    Phaser.Sprite.call(this, game, 0, 0, 'enemy', 0);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.scale.x = this.scale.y = this.baseScale = 0.6;
    this.anchor.setTo(0.5, 0.5);
    this.speed = 50;

    this.animations.add('walk', [0, 1, 2, 3, 4, 5], 8, true);
    this.play('walk');
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.setPosition = function(x, y){
    this.x = x;
    this.y = y;
};

Enemy.prototype.setTarget = function(obj){
    this.target = obj;
}

Enemy.prototype.update = function(){
    this.updateSpeed();
};

Enemy.prototype.updateSpeed = function(){
    var delta = {
        x: this.target.x - this.x,
        y: this.target.y - this.y
    };

    var total = Math.abs(delta.x) + Math.abs(delta.y);
    var ratio = {
        x: delta.x/total,
        y: delta.y/total
    }
    this.body.velocity.x = this.speed * ratio.x;
    this.body.velocity.y = this.speed * ratio.y;

    if (ratio.x > 0){
        this.scale.x = this.baseScale;
    } else if(ratio.x < 0){
        this.scale.x = -this.baseScale;
    }
};

module.exports = Enemy;
