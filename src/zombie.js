var Phaser = require('phaser');

var Zombie = function(game){
    Phaser.Sprite.call(this, game, 0, 0, 'zombie', 0);
    this.scale.x = this.scale.y = this.baseScale = 0.6;
    this.anchor.setTo(0.5, 0.5);
    this.speed = Math.random()*0.5 + 1;
};

Zombie.prototype = Object.create(Phaser.Sprite.prototype);
Zombie.prototype.constructor = Zombie;

Zombie.prototype.setPosition = function(x, y){
    this.x = x;
    this.y = y;
};

Zombie.prototype.setTarget = function(obj){
    this.target = obj;
}

Zombie.prototype.update = function(){
    this.updateSpeed();
};

Zombie.prototype.updateSpeed = function(){
    var delta = {
        x: this.target.x - this.x,
        y: this.target.y - this.y
    };

    var total = Math.abs(delta.x) + Math.abs(delta.y);
    var ratio = {
        x: delta.x/total,
        y: delta.y/total
    }
    this.x += this.speed * ratio.x;
    this.y += this.speed * ratio.y;

    if (ratio.x < 0){
        this.scale.x = this.baseScale;
    } else if(ratio.x > 0){
        this.scale.x = -this.baseScale;
    }
};

module.exports = Zombie;
