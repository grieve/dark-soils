var Phaser = require('phaser');

var Essence = function(scene){
    Phaser.Sprite.call(this, scene.game, 0, 470, 'pixel', 0);
    this.baseValue = this.value = 10000;
    this.baseDrain = this.drain = 1;
    this.scale.y = 10;
    this.alpha = 0.6;
    this.fixedToCamera = true;
};

Essence.prototype = Object.create(Phaser.Sprite.prototype);
Essence.prototype.constructor = Essence;

Essence.prototype.update = function(){
    this.value -= this.drain;
    var adjustedValue = this.value > this.baseValue ? 1: this.value / this.baseValue;
    this.scale.x = this.game.width * adjustedValue;

    var colour = {
        r: 115 + (48 * adjustedValue),
        g: 61 + (129 * adjustedValue),
        b: 64 + (132 * adjustedValue)
    };

    this.tint = colour.r << 16 | colour.g << 8 | colour.b;

    this.drain = this.baseDrain;
};

Essence.prototype.render = function(){
};

module.exports = Essence;
