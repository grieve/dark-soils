var Phaser = require('phaser');

var Essence = function(scene){
    Phaser.Group.prototype.constructor.call(this, scene.game);
    this.bar = new Phaser.Sprite(scene.game, 12, this.game.height - 170, 'essence-bar', 0);
    this.holder = new Phaser.Sprite(scene.game, 12, this.game.height - 170, 'essence-holder', 0);
    this.baseValue = this.value = 10000;
    this.baseDrain = this.drain = 1;
    this.fixedToCamera = true;

    this.cropRect = new Phaser.Rectangle(0, 0, this.bar.width, this.bar.height);

    this.add(this.bar);
    this.add(this.holder);

    this.emitter = this.game.add.emitter(110, this.game.height - 110, 200);
    this.emitter.setXSpeed(0, 0);
    this.emitter.setYSpeed(0, 0);
    this.emitter.setRotation(0, 0);
    this.emitter.gravity = 300;
    this.emitter.makeParticles('blood-particle');
    this.emitter.start(false, 2000, 1000);

    this.add(this.emitter);
};

Essence.prototype = Object.create(Phaser.Group.prototype);
Essence.prototype.constructor = Essence;

Essence.prototype.update = function(){
    this.value -= this.drain;
    var adjustedValue = (this.value > this.baseValue ? 1: this.value / this.baseValue) * 420 + 120;

    this.cropRect.width = adjustedValue; 
    this.bar.crop(this.cropRect);

    this.drain = this.baseDrain;
};

Essence.prototype.render = function(){
};

module.exports = Essence;
