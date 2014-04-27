var Phaser = require('phaser');

var Zombie = function(scene){
    Phaser.Sprite.call(this, scene.game, 0, 0, 'zombie', 0);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.scale.x = this.scale.y = this.baseScale = 0.6;
    this.anchor.setTo(0.5, 0.5);
    this.speed = Math.random()*10 + 15;
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

Zombie.prototype.attack = function(target){
    if (this.attacking){
        return false;
    }
    target.essence.value -= 1000;
    this.attacking = true;
    this.game.time.events.add(2000, function(){
        this.attacking = false;
        this.play('walk');
    }, this);
};

Zombie.prototype.updateSpeed = function(){
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
    }
    this.body.velocity.x = this.speed * ratio.x;
    this.body.velocity.y = this.speed * ratio.y;

    if (ratio.x < 0){
        this.scale.x = this.baseScale;
    } else if(ratio.x > 0){
        this.scale.x = -this.baseScale;
    }
};

module.exports = Zombie;
