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
            create: _.bind(this.onCreate, this),
            update: _.bind(this.onUpdate, this),
            render: _.bind(this.onRender, this)
        }
    );
};

Game.prototype = Object.create(Phaser.Game.prototype);

Game.prototype.transitionScene = function(scene){
    console.log("Transitioning scene: '" + scene + "'");
    var self = this;
    var newScene = new Scenes[scene]({game: this});
    newScene.onPreload(function(){
        newScene.onCreate();
        if (self.goScene) self.goScene.onDestroy();
        self.goScene = newScene;
    });
};

Game.prototype.onPreload = function(){
    Assets.preload(this);
};

Game.prototype.onCreate = function(){

    function getURLParam(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    this.transitionScene(getURLParam('scene')|| 'title');

};

Game.prototype.onUpdate = function(step){

    if('onUpdate' in this.goScene) this.goScene.onUpdate();
};

Game.prototype.onRender = function(){
    this.goScene.onRender();
};

module.exports = Game;
