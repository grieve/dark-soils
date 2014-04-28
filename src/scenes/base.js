var Phaser = require('phaser');
var _ = require('lodash');

var Scene = function(){};

Scene.prototype = Object.create(Phaser.State.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.init = function(){
};

Scene.prototype.preload = function(){
};

Scene.prototype.create = function(){
};

Scene.prototype.render = function(){
};

Scene.prototype.update = function(){
};

Scene.prototype.shutdown = function(){
};

module.exports = Scene;
