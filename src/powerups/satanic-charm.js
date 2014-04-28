var Powerup = require('./base');

var Heart = function(scene, x, y){
    Powerup.prototype.constructor.call(this, scene, x, y);
};

Heart.prototype = Object.create(Powerup.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.graphic = 'satanic-charm';
Heart.prototype.benefit = 1000;
Heart.prototype.effect = "You feel a sinister presence";
Heart.prototype.label = "the heart of dark priest";

module.exports = Heart;
