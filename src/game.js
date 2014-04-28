var _ = require('lodash');
var Phaser = require('phaser');
var Assets = require('./assets');

var Scenes = {
    mapTest: require('./scenes/maptest-scene'),
    game: require('./scenes/game-scene'),
    title: require('./scenes/title-scene')
};

var Levels = require('./config/levels');


var Game = function(){
    Phaser.Game.prototype.constructor.call(
        this,
        800, 480,
        Phaser.AUTO,
        'stage',
        {
            preload: _.bind(this.onPreload, this),
            create: _.bind(this.onCreate, this)
        }
    );
};

Game.prototype = Object.create(Phaser.Game.prototype);

Game.prototype.onPreload = function(){
    Assets.preload(this);
};

Game.prototype.onCreate = function(){

    this.state.add('map-scene', new Scenes.mapTest(), false);
    this.state.add('title-scene', new Scenes.title(), false);
    this.state.add('game-scene', new Scenes.game(), false);

    this.currentLevel = 0;

    function getURLParam(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.state.start((getURLParam('scene') || 'title') + '-scene', true, false, Levels[0]);
};

Game.prototype.nextLevel = function(){

    this.state.start('game-scene', true, false, Levels[0 /*this.currentLevel++*/]);

};

module.exports = Game;
