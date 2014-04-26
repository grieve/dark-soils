var Phaser = require('phaser');

var Scene = require('./scene');
var Tilemap = require('./tilemap');
var Player = require('./player');
var Enemy = require('./enemy');
var MapGen = require('./mapgen');

var TestScene = function(opts){
    Scene.prototype.constructor.call(this, opts);
};

TestScene.prototype = Object.create(Scene.prototype);

TestScene.prototype.onCreate = function(){

    var map = new MapGen();
    map.generate();

    console.log('map', this.game.cache._tilemaps);
    this.game.cache._tilemaps['mapgen-map'] = {
        data: map.exportCSV(),
        format: 0,
        url: null
    };

    var tilemap = new Tilemap({
        game: this.game,
        map: 'mapgen-map',
        tileWidth: 40,
        tileHeight: 40,
        tileset: 'test-tilemap'
    });

    this.player = new Player(this.game);
    this.player.setPosition(
        tilemap.map.width * tilemap.map.tileWidth / 2,
        tilemap.map.height * tilemap.map.tileHeight / 2
    );
    this.game.add.existing(this.player.sprite);

    this.enemy = new Enemy(this.game);
    this.enemy.setPosition(
        this.player.sprite.x + (Math.random() * this.game.width) - this.game.width/2,
        this.player.sprite.y + (Math.random() * this.game.height) - this.game.height/2
    );
    this.enemy.setTarget(this.player.sprite);
    this.game.add.existing(this.enemy.sprite);

    this.game.camera.focusOn(this.player.sprite);
    this.game.camera.follow(this.player.sprite, Phaser.Camera.FOLLOW_TOPDOWN);

    this.sprites.push(this.player);
    this.sprites.push(this.enemy);
};

TestScene.prototype.onUpdate = function(){
    this.player.update();
    this.enemy.update();
    this.resolveZ();
};

TestScene.prototype.resolveZ = function(){
    this.sprites.sort(function(a,b){
        return a.sprite.y - b.sprite.y;
    });

    for (var idx = 0; idx < this.sprites.length; idx++){
        this.sprites[idx].sprite.bringToTop();
    };
};

module.exports = TestScene;
