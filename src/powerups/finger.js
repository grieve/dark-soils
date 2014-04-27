var Powerup = require('./base');

var Finger = function(scene, x, y){
    Powerup.prototype.constructor.call(this, scene, x, y);
};

Finger.prototype = Object.create(Powerup.prototype);
Finger.prototype.constructor = Finger;

Finger.prototype.graphic = 'finger';
Finger.prototype.benefit = 500;
Finger.prototype.label = "the finger of a corrupt judge";

module.exports = Finger;
