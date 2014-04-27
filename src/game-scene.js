var Phaser = require('phaser');

var Scene = require('./scene');
var Tilemap = require('./tilemap');
var Player = require('./player');
var Enemy = require('./enemy');
var MapGen = require('./mapgen');
var Grave = require('./grave');
var Zombie = require('./zombie');
var LostSoul = require('./lost-soul');
var Essence = require('./essence');
var Light = require('./light');
var Narrative = require('./narrative');

var Powerups = {
    Heart: require('./powerups/heart'),
    Bones: require('./powerups/bones'),
    Finger: require('./powerups/finger')
};

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

    this.camera.focusOn(this.player);
    this.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);

    this.sprites.push(this.player);

    this.firstZombie = true;
    this.firstSoul = true;

    this.holes = [];
    this.zombies = [];
    this.graves = [];

    // TEST ZOMBIE
    //var z = new Zombie(this);
    //z.setTarget(this.player);
    //z.setPosition(this.enemy.x, this.enemy.y);
    //this.add.existing(z);
    //this.zombies.push(z);
    //this.sprites.push(z);


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

    this.narrative = new Narrative(this);
    this.add.existing(this.narrative);
    this.game.time.events.add(2000, function(){
        this.narrative.playChapter('intro');
    }, this);

    this.digCount = 0;
};

GameScene.prototype.update = function(){
    this.physics.arcade.collide(this.player, this.graves);
    this.physics.arcade.collide(this.enemy, this.graves);
    this.physics.arcade.collide(this.player, this.enemy, this.enemyAttack, null, this);
    this.physics.arcade.collide(this.player, this.zombies, this.enemyAttack, null, this);
    this.player.update();
    if(this.enemy) this.enemy.update();
    this.player.essence.update();
    this.resolveZ();

    if(this.player.essence.value <= 0){
        this.game.state.start('title-scene');
    }
};

GameScene.prototype.enemyAttack = function(player, enemy){
    enemy.attack(player);
};

GameScene.prototype.destroy = function(){
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

    if(this.powerup) this.game.world.bringToTop(this.powerup);
    this.player.essence.bringToTop();
    this.game.world.bringToTop(this.narrative);
};

GameScene.prototype.render = function(){
    //this.game.debug.body(this.player);
    //this.game.debug.body(this.enemy);
    //for (var idx = 0; idx < this.graves.length; idx++){
    //    this.game.debug.body(this.graves[idx]);
    //}
    //for (var idx = 0; idx < this.zombies.length; idx++){
    //    this.game.debug.body(this.zombies[idx]);
    //}
    //
    this.player.onRender();
    this.player.essence.render();
};

GameScene.prototype.getDigArea = function(){
    var idx;
    for(idx = 0; idx < this.graves.length; idx++){
        if (this.player.overlap(this.graves[idx])){
            if (this.digCount > 4){
                return null;
            }
            if (this.graves[idx].frame == 1){
                return null;
            }
            return {
                type: "grave",
                grave: this.graves[idx],
                time: DigTimes.grave
            };
        }
    }

    for (idx = 0; idx < this.holes.length; idx++){
        if (this.player.overlap(this.holes[idx])){
            return null;
        }
    }

    // determine dynamically from terrain and contents
    var type = 'grass';

    var digArea = {
        type: type,
        reward: null,
        time: DigTimes[type]
    };

    if (Math.random() > 0.8){
        digArea.reward = Object.keys(Powerups)[Math.floor(Math.random()*Object.keys(Powerups).length)];
    }

    // guarantee reward the first time
    if (this.digCount == 0){
        digArea.reward = Object.keys(Powerups)[Math.floor(Math.random()*Object.keys(Powerups).length)];
    }

    return digArea;
};

GameScene.prototype.completedDig = function(){
    switch(this.digCount){
        case 0:
            this.narrative.playChapter('firstpowerup');
            break;
        case 1:
            this.spawnGroundskeeper();
            this.narrative.playChapter('groundskeeper');
            break;
        case 3:
            this.narrative.playChapter('graves');
            break;
    }
    this.digCount++;

    var hole = this.add.sprite(this.player.body.x, this.player.body.y, 'hole', 0); 
    hole.scale.x = hole.scale.y = 0.6;
    hole.anchor.set(0.5);

    this.holes.push(hole);
};

GameScene.prototype.openGrave = function(grave){
    grave.open();
    console.log("--" + grave.contents + "--");
    switch(grave.contents){
        case "zombie":
            this.spawnZombie(grave);
            if(this.firstZombie){
                this.narrative.playChapter('zombie');
                this.firstZombie = false;
            };
            break;
        case "heart":
            this.spawnHeart(grave);
            break;
        case "lostsoul":
            this.spawnLostSoul(grave);
            if(this.firstSoul){
                this.narrative.playChapter('lostsoul');
                this.firstSoul = false;
            };
            break;
    }
};

GameScene.prototype.spawnGroundskeeper = function(){
    this.enemy = new Enemy(this);
    if (Math.random() > 0.5){
        this.enemy.setPosition(
            this.player.x - this.game.width/2 - 200,
            this.player.y + (Math.random() * this.game.height) - this.game.height/2
        );
    } else {
        this.enemy.setPosition(
            this.player.x + this.game.width/2 + 200,
            this.player.y + (Math.random() * this.game.height) - this.game.height/2
        );
    }
    this.enemy.setTarget(this.player);
    this.add.existing(this.enemy);

    this.light = new Light(this, { radius: 400, id: 'lantern', color: '#ffff66' });
    this.light.attachTo(this.enemy);
    this.add.existing(this.light);
    this.sprites.push(this.enemy);
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
    this.spawnPowerup(grave.x, grave.y, 'Heart');
};

GameScene.prototype.spawnPowerup = function(x, y, type){
    this.powerup = new Powerups[type](this, x, y);
    this.add.existing(this.powerup);
    this.player.essence.value += this.powerup.benefit;
    console.log("Found " + this.powerup.label);
};

module.exports = GameScene;
