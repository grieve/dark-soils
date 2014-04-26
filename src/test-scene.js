var Phaser = require('phaser');

var Scene = require('./scene');
var Tilemap = require('./tilemap');
var Player = require('./player');
var Enemy = require('./enemy');

var TestScene = function(opts){
    Scene.prototype.constructor.call(this, opts);
};

TestScene.prototype = Object.create(Scene.prototype);

TestScene.prototype.onCreate = function(){
    this.tilemap = new Tilemap({
        game: this.game,
        map: "test-map",
        tileWidth: 40,
        tileHeight: 40,
        tileset: 'base-tileset'
    });
    
    this.player = new Player(this.game);
    this.player.setPosition(
        this.tilemap.map.width * this.tilemap.map.tileWidth / 2,
        this.tilemap.map.height * this.tilemap.map.tileHeight / 2
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

    this.sprites.push(this.player.sprite);
    this.sprites.push(this.enemy.sprite);
};

TestScene.prototype.onUpdate = function(){
    this.player.update();
    this.enemy.update();
    this.resolveZ();
    
    if(this.enemy.sprite.overlap(this.player.sprite)){
        this.onPlayerCaught();
    }
};

TestScene.prototype.onDestroy = function(){
    Scene.prototype.onDestroy.call(this);
    this.tilemap.destroy();
};

TestScene.prototype.resolveZ = function(){
    this.sprites.sort(function(a,b){
        return a.y - b.y;
    });

    for (var idx = 0; idx < this.sprites.length; idx++){
        this.sprites[idx].bringToTop();
    };
};

TestScene.prototype.onPlayerCaught = function(){
    this.game.transitionScene('title');
};

module.exports = TestScene;
