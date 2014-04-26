var _ = require('lodash');
var Phaser = require('phaser');
var LogoScene = require('./logo-scene');
var MapTestScene = require('./maptest-scene');
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

    this.logoScene = new LogoScene({game: this});
    this.mapTestScene = new MapTestScene({game: this});
    this.zOrdering = new Array(1000);
    this.testScene = new TestScene({game: this});

    function getURLParam(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    this.goScene = this[getURLParam('scene') + 'Scene'] || this.testScene;

};

Game.prototype = Object.create(Phaser.Game.prototype);

Game.prototype.onPreload = function(){
    Assets.preload(this);
    if('onPreload' in this.goScene) this.goScene.onPreload();
};

Game.prototype.onCreate = function(){

    if('onCreate' in this.goScene) this.goScene.onCreate();
};

Game.prototype.onUpdate = function(step){
    //this.logoScene.onUpdate();


    if('onUpdate' in this.goScene) this.goScene.onUpdate();
};

module.exports = Game;
