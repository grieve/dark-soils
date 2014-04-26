var Phaser = require('phaser');

var Scene = require('./scene');
var Tilemap = require('./tilemap');
var Player = require('./player');
var Enemy = require('./enemy');
var Grave = require('./grave');

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
    this.game.add.existing(this.player);

    this.enemy = new Enemy(this.game);
    this.enemy.setPosition(
        this.player.x + (Math.random() * this.game.width) - this.game.width/2,
        this.player.y + (Math.random() * this.game.height) - this.game.height/2
    );
    this.enemy.setTarget(this.player);
    this.game.add.existing(this.enemy);

    this.game.camera.focusOn(this.player);
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);

    this.sprites.push(this.player);
    this.sprites.push(this.enemy);

    this.graves = [];

    var grave;
    var contents = ['heart', 'zombie', 'nothing'];
    for (var idx = 0; idx < 10; idx++){
        grave = new Grave(
            this.game,
            Math.random() * this.tilemap.map.width * this.tilemap.map.tileWidth,
            Math.random() * this.tilemap.map.height * this.tilemap.map.tileHeight,
            contents[Math.floor(Math.random() * contents.length)]
        );
        this.graves.push(grave);
        this.sprites.push(grave);
        this.game.add.existing(grave);
    }
};

TestScene.prototype.onUpdate = function(){
    this.game.physics.arcade.collide(this.player, this.graves);
    this.player.update();
    this.enemy.update();
    this.resolveZ();
    
    if(this.enemy.overlap(this.player)){
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
    //this.game.transitionScene('title');
};

TestScene.prototype.onRender = function(){
    //this.game.debug.body(this.player);
    //for (var idx = 0; idx < this.graves.length; idx++){
    //    this.game.debug.body(this.graves[idx]);
    //}
};

module.exports = TestScene;
