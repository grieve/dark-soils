var Phaser = require('phaser');

var Scene = require('./scene');
var Tilemap = require('./tilemap');
var Player = require('./player');
var Enemy = require('./enemy');
var MapGen = require('./mapgen');
var Grave = require('./grave');
var Heart = require('./heart');
var Zombie = require('./zombie');
var LostSoul = require('./lost-soul');
var Essence = require('./essence');
var Light = require('./light');

var DigTimes = {
    dirt: 1500,
    grass: 2000,
    stone: 3500,
    grave: 5000
};

var GameScene = function(){
    Scene.prototype.constructor.call(this);
};

GameScene.prototype = Object.create(Scene.prototype);
GameScene.prototype.constructor = GameScene;

GameScene.prototype.create = function(){

    var map = new MapGen();
    map.generate();

    this.game.cache._tilemaps['mapgen-map'] = {
        data: map.exportCSV(),
        format: 0,
        url: null
    };

    this.tilemap = new Tilemap({
        game: this,
        map: 'mapgen-map',
        tileWidth: 64,
        tileHeight: 64,
        tileset: 'mapgen-tileset'
    });

    this.sprites = [];

    this.player = new Player(this);
    this.player.setPosition(
        this.world.centerX,
        this.world.centerY
    );
    this.add.existing(this.player);

    this.enemy = new Enemy(this);
    if (Math.random() > 0.5){
        this.enemy.setPosition(
            this.player.x - this.game.width/2,
            this.player.y + (Math.random() * this.game.height) - this.game.height/2
        );
    } else {
        this.enemy.setPosition(
            this.player.x + this.game.width/2,
            this.player.y + (Math.random() * this.game.height) - this.game.height/2
        );
    }
    this.enemy.setTarget(this.player);
    this.add.existing(this.enemy);

    this.light = new Light(this, { radius: 400, id: 'lantern', color: '#ffff66' });
    this.light.attachTo(this.enemy);
    this.add.existing(this.light);

    this.camera.focusOn(this.player);
    this.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);

    this.sprites.push(this.player);
    this.sprites.push(this.enemy);

    this.zombies = [];
    this.graves = [];

    var grave;
    var contents = ['heart', 'lostsoul', 'zombie', 'nothing'];
    for (var idx = 0; idx < 20; idx++){
        grave = new Grave(
            this,
            Math.random() * this.world.width,
            Math.random() * this.world.height,
            contents[Math.floor(Math.random() * contents.length)]
        );
        this.graves.push(grave);
        this.sprites.push(grave);
        this.add.existing(grave);
    }

    this.player.essence = new Essence(this);
    this.add.existing(this.player.essence);
};

GameScene.prototype.update = function(){
    this.physics.arcade.collide(this.player, this.graves);
    this.physics.arcade.collide(this.enemy, this.graves);
    this.physics.arcade.collide(this.player, this.enemy, this.enemyAttack, null, this);
    this.physics.arcade.collide(this.player, this.zombies, this.enemyAttack, null, this);
    this.player.update();
    this.enemy.update();
    this.player.essence.update();
    this.resolveZ();

    if(this.player.essence.value <= 0){
        this.game.state.start('title-scene');
    }
};

GameScene.prototype.enemyAttack = function(player, enemy){
    enemy.attack(player);
};

GameScene.prototype.onDestroy = function(){
    Scene.prototype.onDestroy.call(this);
    this.tilemap.destroy();
};

GameScene.prototype.resolveZ = function(){
    this.sprites.sort(function(a,b){
        return a.y - b.y;
    });

    for (var idx = 0; idx < this.sprites.length; idx++){
        if("onReorderZ" in this.sprites[idx]){
            this.sprites[idx].onReorderZ();
        } else {
            this.sprites[idx].bringToTop();
        }
    }

    if(this.heart) this.heart.bringToTop();
    this.player.essence.bringToTop();
};

GameScene.prototype.onRender = function(){
    //this.game.debug.body(this.player);
    //this.game.debug.body(this.enemy);
    //for (var idx = 0; idx < this.graves.length; idx++){
    //    this.game.debug.body(this.graves[idx]);
    //}
    //for (var idx = 0; idx < this.zombies.length; idx++){
    //    this.game.debug.body(this.zombies[idx]);
    //}
    this.player.onRender();
    this.player.essence.render();
};

GameScene.prototype.getDigArea = function(){
    for(var idx = 0; idx < this.graves.length; idx++){
        if (this.player.overlap(this.graves[idx])){
            return {
                type: "grave",
                grave: this.graves[idx],
                time: DigTimes.grave
            };
        }
    }
    // determine dynamically from terrain and contents
    var type = 'grass';
    return {
        type: type,
        reward: null,
        time: DigTimes[type]
    };
};

GameScene.prototype.openGrave = function(grave){
    grave.open();
    console.log("--" + grave.contents + "--");
    switch(grave.contents){
        case "zombie":
            this.spawnZombie(grave);
            break;
        case "heart":
            this.spawnHeart(grave);
            break;
        case "lostsoul":
            this.spawnLostSoul(grave);
            break;
    }
};

GameScene.prototype.spawnZombie = function(grave){
    var zombie = new Zombie(this);
    zombie.setTarget(this.player);
    zombie.setPosition(grave.x, grave.y + 100);
    this.sprites.push(zombie);
    this.zombies.push(zombie);
    this.add.existing(zombie);
};

GameScene.prototype.spawnLostSoul = function(grave){
    var lostSoul = new LostSoul(this);
    lostSoul.setTarget(this.enemy);
    lostSoul.setPosition(grave.x, grave.y + 100);
    this.sprites.push(lostSoul);
    this.add.existing(lostSoul);
};

GameScene.prototype.spawnHeart = function(grave){
    this.heart = new Heart(this, grave.x, grave.y);
    this.add.existing(this.heart);
    this.player.essence.value += 2000;
};

module.exports = GameScene;
