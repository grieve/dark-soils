var Phaser = require('phaser');

var Scene = require('./scene');
var Tilemap = require('./tilemap');
var Player = require('./player');
var Enemy = require('./enemy');
var MapGen = require('./mapgen');
var Grave = require('./grave');
var Zombie = require('./zombie');

var TestScene = function(opts){
    Scene.prototype.constructor.call(this, opts);
};

TestScene.prototype = Object.create(Scene.prototype);

TestScene.prototype.onCreate = function(){

    var map = new MapGen();
    map.generate();

    this.game.cache._tilemaps['mapgen-map'] = {
        data: map.exportCSV(),
        format: 0,
        url: null
    };

    var tilemap = new Tilemap({
        game: this.game,
        map: 'mapgen-map',
        tileWidth: 64,
        tileHeight: 64,
        tileset: 'mapgen-tileset'
    });

    this.player = new Player(this.game);
    this.player.setPosition(
        this.game.world.centerX,
        this.game.world.centerY
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
            Math.random() * this.game.world.width,
            Math.random() * this.game.world.height,
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

    if(this.player.actionButton.justReleased(25)){
        for(var idx = 0; idx < this.graves.length; idx++){
            if (this.player.overlap(this.graves[idx])){
                this.graves[idx].open();
                if(this.graves[idx].contents == 'zombie'){
                    var zombie = new Zombie(this.game);
                    zombie.setTarget(this.player);
                    zombie.setPosition(this.graves[idx].x, this.graves[idx].y + 100);
                    this.sprites.push(zombie);
                    this.game.add.existing(zombie);
                }
            }
        }
    }

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
