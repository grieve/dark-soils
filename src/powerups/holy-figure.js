var Powerup = require('./base');

var Heart = function(scene, x, y){
    Powerup.prototype.constructor.call(this, scene, x, y);
};

Heart.prototype = Object.create(Powerup.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.graphic = 'holy-figure';
Heart.prototype.benefit = -1000;
Heart.prototype.effect = "You feel blessed".
Heart.prototype.label = "the figurine of a holy icon";

module.exports = Heart;
