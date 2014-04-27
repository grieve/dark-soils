var _ = require('lodash');
var Phaser = require('phaser');
var Assets = require('./assets');

var Scenes = {
    mapTest: require('./maptest-scene'),
    game: require('./game-scene'),
    title: require('./title-scene')
};


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

    function getURLParam(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.state.start((getURLParam('scene') || 'title') + '-scene');
};

module.exports = Game;
