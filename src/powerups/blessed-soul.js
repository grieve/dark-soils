var Powerup = require('./base');

var Heart = function(scene, x, y){
    Powerup.prototype.constructor.call(this, scene, x, y);
};

Heart.prototype = Object.create(Powerup.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.graphic = 'blessed-soul';
Heart.prototype.benefit = -1000;
Heart.prototype.effect = "Essence drained";
Heart.prototype.label = "the soul of a devout being";

module.exports = Heart;
