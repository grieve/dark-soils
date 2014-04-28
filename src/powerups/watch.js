var Powerup = require('./base');

var Heart = function(scene, x, y){
    Powerup.prototype.constructor.call(this, scene, x, y);
};

Heart.prototype = Object.create(Powerup.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.graphic = 'watch';
Heart.prototype.benefit = 0;
Heart.prototype.effect = "He probably wants this back";
Heart.prototype.label = "the Groundskeeper's pocket watch";

module.exports = Heart;
