var Powerup = require('./base');

var Heart = function(scene, x, y){
    Powerup.prototype.constructor.call(this, scene, x, y);
};

Heart.prototype = Object.create(Powerup.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.graphic = 'puzzle-cube';
Heart.prototype.benefit = 1000;
Heart.prototype.effect = "You are puzzled"
Heart.prototype.label = "a mysterious puzzle cube";

module.exports = Heart;
