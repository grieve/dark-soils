var Powerup = require('./base');

var Heart = function(scene, x, y){
    Powerup.prototype.constructor.call(this, scene, x, y);
};

Heart.prototype = Object.create(Powerup.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.graphic = 'blessed-soul';
Heart.prototype.benefit = -1000;
Heart.prototype.effect = "Essence drained";
Heart.prototype.label = [
    "a devout priest's patience",
    "the soul of a holy monk",
    "the spirit of a chaste man",
    "the humble remnants of a cleric",
    "the charity of an angel",
    "a child's innocence",
    "a sliver of tolerance"
];

module.exports = Heart;
