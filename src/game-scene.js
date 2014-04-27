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

var GameScene = function(opts){
    Scene.prototype.constructor.call(this, opts);
};

GameScene.prototype = Object.create(Scene.prototype);

GameScene.prototype.onCreate = function(){

    var map = new MapGen();
    map.generate();

    this.game.cache._tilemaps['mapgen-map'] = {
        data: map.exportCSV(),
        format: 0,
        url: null
    };

    this.tilemap = new Tilemap({
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
    this.game.add.existing(this.enemy);

    this.light = new Light(this.game, { radius: 400, id: 'lantern', color: '#ffff66' });
    this.light.attachTo(this.enemy);
    this.game.add.existing(this.light);

    this.game.camera.focusOn(this.player);
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);

    this.sprites.push(this.player);
    this.sprites.push(this.enemy);

    this.zombies = [];
    this.graves = [];

    var grave;
    var contents = ['heart', 'lostsoul', 'zombie', 'nothing'];
    for (var idx = 0; idx < 20; idx++){
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

    var style = {font: "20px Arial", fill: "#fff", align: "left"};
    this.player.essence = new Essence(this.game);
    this.game.add.existing(this.player.essence);
};

GameScene.prototype.onUpdate = function(){
    this.game.physics.arcade.collide(this.player, this.graves);
    this.game.physics.arcade.collide(this.enemy, this.graves);
    this.game.physics.arcade.collide(this.player, this.enemy, this.enemyAttack, null, this);
    this.game.physics.arcade.collide(this.player, this.zombies, this.enemyAttack, null, this);
    this.player.update();
    this.enemy.update();
    this.player.essence.update();
    this.resolveZ();

    if(this.player.essence.value <= 0){
        this.game.transitionScene('title');
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
    var zombie = new Zombie(this.game);
    zombie.setTarget(this.player);
    zombie.setPosition(grave.x, grave.y + 100);
    this.sprites.push(zombie);
    this.zombies.push(zombie);
    this.game.add.existing(zombie);
};

GameScene.prototype.spawnLostSoul = function(grave){
    var lostSoul = new LostSoul(this.game);
    lostSoul.setTarget(this.enemy);
    lostSoul.setPosition(grave.x, grave.y + 100);
    this.sprites.push(lostSoul);
    this.game.add.existing(lostSoul);
};

GameScene.prototype.spawnHeart = function(grave){
    this.heart = new Heart(this.game, grave.x, grave.y);
    this.game.add.existing(this.heart);
    this.player.essence.value += 2000;
};

module.exports = GameScene;
