var Phaser = require('phaser');

var LostSoul = function(scene){
    Phaser.Sprite.call(this, scene.game, 0, 0, 'lost-soul', 0);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.scale.x = this.scale.y = this.baseScale = 0.6;
    this.anchor.setTo(0.5, 0.5);
    this.speed = 120;

    this.animations.add('waft', [0, 1, 2, 3], 8, true);
    this.play('waft');
};

LostSoul.prototype = Object.create(Phaser.Sprite.prototype);
LostSoul.prototype.constructor = LostSoul;

LostSoul.prototype.setPosition = function(x, y){
    this.x = x;
    this.y = y;
};

LostSoul.prototype.setTarget = function(obj){
    this.target = obj;
};

LostSoul.prototype.update = function(){
    this.updateSpeed();
    this.checkOverlap();
};

LostSoul.prototype.updateSpeed = function(){
    var delta = {
        x: this.target.x - this.x,
        y: this.target.y - this.y + 5
    };

    var total = Math.abs(delta.x) + Math.abs(delta.y);
    var ratio = {
        x: delta.x/total,
        y: delta.y/total
    };
    this.body.velocity.x = this.speed * ratio.x;
    this.body.velocity.y = this.speed * ratio.y;
    if (ratio.x < 0){
        this.scale.x = this.baseScale;
    } else if(ratio.x > 0){
        this.scale.x = -this.baseScale;
    }
};

LostSoul.prototype.checkOverlap = function(){
    if(this.overlap(this.target)){
        this.target.speed *= 0.2;
        if(!this.deathTimer){
            this.deathTimer = this.game.time.events.add(5000, this.kill, this);
        }
    }
};

module.exports = LostSoul;
