var Phaser = require('phaser');

var Enemy = function(scene){
    Phaser.Sprite.call(this, scene.game, 0, 0, 'enemy', 0);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(this.width*0.55, this.height*0.35, -this.width*0.1, this.height*0.2);
    this.scale.x = this.scale.y = this.baseScale = 0.6;
    this.anchor.setTo(0.5, 0.5);
    this.normalSpeed = 80;
    this.speed = 80;

    this.regions = scene.mapGen.getRegions();
    this.tileSize = scene.mapGen.tileSize;

    this.teleporting = false;

    this.animations.add('walk', [0, 1, 2, 3, 4, 5], 8, true);
    this.animations.add('stab', [1, 0, 0, 0, 6, 6, 0, 1], 10, false);
    this.play('walk');
    this.scene = scene;

    this.bloodEmitter = this.game.add.emitter(this.x, this.y, 2000);
    this.bloodEmitter.setXSpeed(-100, 100);
    this.bloodEmitter.setYSpeed(-100, 100);
    this.bloodEmitter.gravity = 300;
    this.bloodEmitter.makeParticles('blood-particle');
};

var rndInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

Enemy.prototype.onReorderZ = function(){
    this.game.world.bringToTop(this.bloodEmitter);
    this.bringToTop();
};

Enemy.prototype.teleport = function() {

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    this.teleporting = true;
    this.target.bloodEmitter.x = this.x;
    this.target.bloodEmitter.y = this.y;
    this.target.bloodEmitter.start(true, 300, null, 50);

    var tr = this.regions[rndInt(0, this.regions.length -1)];
    console.log('teleport', tr);

    var landings = [
        { x: tr.x, y: tr.y },
        { x: tr.x + tr.width - 1, y: tr.y },
        { x: tr.x, y: tr.y + tr.height - 1 },
        { x: tr.x + tr.width - 1, y: tr.y + tr.height - 1 }
    ];
    var tl = landings[rndInt(0, 3)];
    this.setPosition((tl.x + 0.5) * this.tileSize, (tl.y + 0.5) * this.tileSize );
    this.teleporting = false;

};

Enemy.prototype.attack = function(target){
    if (this.attacking){
        return false;
    }
    this.play('stab');
    this.attacking = true;
    this.game.time.events.add(500, function(){
        target.essence.value -= 4000;
        this.scene.notifications.addMessage('Essence stolen', true);
        target.hurtAnim(this);
    }, this);
    this.game.time.events.add(2000, function(){
        this.attacking = false;
        this.play('walk');
    }, this);
};

Enemy.prototype.updateSpeed = function(){

    if (this.teleporting) return;

    if (this.attacking){
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        return;
    }

    if(this.target.death){
        this.body.velocity.x = this.speed;
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
