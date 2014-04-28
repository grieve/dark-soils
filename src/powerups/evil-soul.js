var Powerup = require('./base');

var Heart = function(scene, x, y){
    Powerup.prototype.constructor.call(this, scene, x, y);
};

Heart.prototype = Object.create(Powerup.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.graphic = 'evil-soul';
Heart.prototype.benefit = 1500;
Heart.prototype.effect = "Essence added";
Heart.prototype.label = "the soul of a depraved maniac";

module.exports = Heart;
