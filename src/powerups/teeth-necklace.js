var Powerup = require('./base');

var Heart = function(scene, x, y){
    Powerup.prototype.constructor.call(this, scene, x, y);
};

Heart.prototype = Object.create(Powerup.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.graphic = 'teeth-necklace';
Heart.prototype.benefit = 500;
Heart.prototype.effect = "You feel hungry";
Heart.prototype.label = "beautiful jewelry made from human teeth";

module.exports = Heart;
