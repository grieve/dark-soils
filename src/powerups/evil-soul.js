var Powerup = require('./base');

var Heart = function(scene, x, y){
    Powerup.prototype.constructor.call(this, scene, x, y);
};

Heart.prototype = Object.create(Powerup.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.graphic = 'evil-soul';
Heart.prototype.benefit = 1500;
Heart.prototype.effect = "Essence added";
Heart.prototype.label = [
    "the soul of a depraved maniac",
    "a glimpse of a murderer's spirit",
    "the intent of an adulterer",
    "a toturer's wrath",
    "a demon's desire",
    "the needs of an addict"
];

module.exports = Heart;
