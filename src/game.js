var _ = require('lodash');
var Phaser = require('phaser');
var TestScene = require('./test-scene');
var Assets = require('./assets');

var Game = function(){
    Phaser.Game.prototype.constructor.call(
        this,
        800, 480,
        Phaser.AUTO,
        'stage',
        {
            preload: _.bind(this.onPreload, this),
            create: _.bind(this.onCreate, this),
            update: _.bind(this.onUpdate, this)
        }
    );

    this.testScene = new TestScene({game: this});
};

Game.prototype = Object.create(Phaser.Game.prototype);

Game.prototype.onPreload = function(){
    Assets.preload(this);
    this.testScene.onPreload();
};

Game.prototype.onCreate = function(){
    this.testScene.onCreate();
};

Game.prototype.onUpdate = function(step){
    this.testScene.onUpdate();
};

module.exports = Game;
