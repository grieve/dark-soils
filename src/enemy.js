var Phaser = require('phaser');

var Enemy = function(scene){
    Phaser.Sprite.call(this, scene.game, 0, 0, 'enemy', 0);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(this.width*0.55, this.height*0.35, -this.width*0.1, this.height*0.2);
    this.scale.x = this.scale.y = this.baseScale = 0.6;
    this.anchor.setTo(0.5, 0.5);
    this.normalSpeed = 50;
    this.speed = 50;

    this.animations.add('walk', [0, 1, 2, 3, 4, 5], 8, true);
    this.animations.add('stab', [1, 0, 0, 0, 6, 6, 0, 1], 10, false);
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
};

Enemy.prototype.update = function(){
    this.updateSpeed();
};

Enemy.prototype.attack = function(target){
    if (this.attacking){
        return false;
    }
    this.play('stab');
    this.attacking = true;
    this.game.time.events.add(500, function(){
        target.essence.value -= 4000;
    }, this);
    this.game.time.events.add(2000, function(){
        this.attacking = false;
        this.play('walk');
    }, this);
};

Enemy.prototype.updateSpeed = function(){
    if (this.attacking){
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        return;
    }
    var delta = {
        x: this.target.x - this.x,
        y: this.target.y - this.y
    };

    var total = Math.abs(delta.x) + Math.abs(delta.y);
    var ratio = {
        x: delta.x/total,
        y: delta.y/total
    };
    this.body.velocity.x = this.speed * ratio.x;
    this.body.velocity.y = this.speed * ratio.y;

    if (ratio.x > 0){
        this.scale.x = this.baseScale;
    } else if(ratio.x < 0){
        this.scale.x = -this.baseScale;
    }

    this.speed = this.normalSpeed;
};

module.exports = Enemy;
