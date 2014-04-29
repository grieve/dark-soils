var Phaser = require('phaser');

var Zombie = function(scene){
    Phaser.Sprite.call(this, scene.game, 0, 0, 'zombie', 0);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(this.width*0.32, this.height*0.2, 0, this.height*0.2);
    this.scale.x = this.scale.y = this.baseScale = 0.6;
    this.anchor.setTo(0.35, 0.5);
    this.speed = Math.random()*10 + 15;

    this.animations.add('stand', [0], 8, true);
    this.animations.add('walk', [0, 1, 2], 5, true);
    this.animations.add('attack', [0, 0, 1, 1, 3, 3, 3, 1], 8, false);

    this.play('walk');
    this.scene = scene;

    this.aimless = {};
    this.aimless.x = Math.random() * 2 - 1;
    this.aimless.y = 1 - Math.abs(this.aimless.x);
    if(Math.random() > 0.5) this.aimless.y *= -1;
};

Zombie.prototype = Object.create(Phaser.Sprite.prototype);
Zombie.prototype.constructor = Zombie;

Zombie.prototype.setPosition = function(x, y){
    this.x = x;
    this.y = y;
};

Zombie.prototype.setTarget = function(obj){
    this.target = obj;
};

Zombie.prototype.update = function(){
    this.updateSpeed();
};

Zombie.prototype.attack = function(target){
    if (this.attacking){
        return false;
    }
    target.essence.value -= 1000;
    this.scene.notifications.addMessage('Essence stolen', true);
    target.hurtAnim(this);
    this.attacking = true;
    this.play('attack');
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
    if(this.target.death){
        ratio.x = this.aimless.x;
        ratio.y = this.aimless.y;
    }
    this.body.velocity.x = this.speed * ratio.x;
    this.body.velocity.y = this.speed * ratio.y;

    if (ratio.x > 0){
        this.scale.x = this.baseScale;
    } else if(ratio.x < 0){
        this.scale.x = -this.baseScale;
    }
};

module.exports = Zombie;
