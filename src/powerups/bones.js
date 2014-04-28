var Powerup = require('./base');

var Bones = function(scene, x, y){
    Powerup.prototype.constructor.call(this, scene, x, y);
};

Bones.prototype = Object.create(Powerup.prototype);
Bones.prototype.constructor = Bones;

Bones.prototype.graphic = "bones";
Bones.prototype.benefit = 1000;
Bones.prototype.effect = "Essence added";
Bones.prototype.label = "the bones of a satanist";

module.exports = Bones;
