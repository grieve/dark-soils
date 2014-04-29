var Phaser = require('phaser');
var Actor = require('./actor');

var Enemy = function(scene, x, y, 'graphic'){
    Actor.prototype.constructor.call(this, scene, x, y, graphic);
};

Enemy.prototype = Object.create(Actor.prototype);
