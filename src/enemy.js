var Phaser = require('phaser');

var Enemy = function(game){
    this.sprite = new Phaser.Sprite(game, 0, 0, 'enemy', 0);
    this.scale = 0.6;
    this.sprite.scale.x = this.sprite.scale.y = this.scale;
    this.sprite.anchor.setTo(0.5, 0.5);
    this.speed = 3;
};

Enemy.prototype.setPosition = function(x, y){
    this.sprite.x = x;
    this.sprite.y = y;
};

Enemy.prototype.setTarget = function(obj){
    this.target = obj;
}

Enemy.prototype.update = function(){
    this.updateSpeed();
};

Enemy.prototype.updateSpeed = function(){
    var delta = {
        x: this.target.x - this.sprite.x,
        y: this.target.y - this.sprite.y
    };

    var total = Math.abs(delta.x) + Math.abs(delta.y);
    var ratio = {
        x: delta.x/total,
        y: delta.y/total
    }
    this.sprite.x += this.speed * ratio.x;
    this.sprite.y += this.speed * ratio.y;

    if (ratio.x < 0){
        this.sprite.scale.x = this.scale;
    } else if(ratio.x > 0){
        this.sprite.scale.x = -this.scale;
    }
};

module.exports = Enemy;
