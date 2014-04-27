var Powerup = require('./base');

var Heart = function(scene, x, y){
    Powerup.prototype.constructor.call(this, scene, x, y);
};

Heart.prototype = Object.create(Powerup.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.graphic = 'heart';
Heart.prototype.benefit = 3000;
Heart.prototype.label = "the heart of dark priest";

module.exports = Heart;
