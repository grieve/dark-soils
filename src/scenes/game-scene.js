var Phaser = require('phaser');

var Scene = require('./base');
var Tilemap = require('../tilemap');
var TileGen = require('../tilegen');
var MapGen = require('../mapgen');

var Actors = {
	Player: require('../actors/player'),
	Argos: require('../actors/argos'),
	Enemy: require('../actors/enemy'),
	Zombie: require('../actors/zombie'),
	LostSoul: require('../actors/lost-soul')
};

var UI = {
	Essence: require('../ui/essence'),
	Light: require('../ui/light'),
    Vignette: require('../ui/vignette'),
	Narrative: require('../ui/narrative'),
    Notifications: require('../ui/notifications')
};

var Environment = {
	Grave: require('../environ/grave'),
	DogGrave: require('../environ/dog-grave'),
	Treasure: require('../environ/treasure'),
    Hole: require('../environ/hole'),
    Rain: require('../environ/rain')
}

var Powerups = {
    Heart: require('../powerups/heart'),
    Bones: require('../powerups/bones'),
    Finger: require('../powerups/finger'),
    BlessedSoul: require('../powerups/blessed-soul'),
    EvilSoul: require('../powerups/evil-soul'),
    PuzzleCube: require('../powerups/puzzle-cube'),
    SatanicCharm: require('../powerups/satanic-charm'),
    Watch: require('../powerups/watch'),
    HolyFigure: require('../powerups/holy-figure'),
    TeethNecklace: require('../powerups/teeth-necklace')
};


var DigTimes = {
    soil: 2000,
    grass: 3000,
    transition: 3000,
    water: 4000,
    mud: 5000,
    rock: 7500,
    grave: 10000
};

var DigChances = {
    soil: [0.1, 0.3],
    grass: [0.2, 0.45],
    transition: [0.2, 0.2],
    water: [0.25, 0.3],
    mud: [0.3, 0.5],
    rock: [0.4, 0.6]
};

var GameScene = function(){
    Scene.prototype.constructor.call(this);
};

GameScene.prototype = Object.create(Scene.prototype);
GameScene.prototype.constructor = GameScene;


GameScene.prototype.create = function(){
};

GameScene.prototype.init = function(config){
    window.startTime = this.game.time.now;
    window.essence = 0;
    this.config = config;

    this.mapGen = new MapGen();
    var tileGen = new TileGen({
        game: this,
        terrainTypes: this.mapGen.terrainTypes,
        baseTile: 6,
        tileImg: 'mapgen-tileset',
        maskImg: 'masks'
    });
    tileGen.generate();
    this.mapGen.generate();
    this.mapGen.generateTileTransitions();

    this.game.cache._tilemaps['mapgen-map'] = {
        data: this.mapGen.exportCSV(),
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
    this.tilemap.map.addTilesetImage('tilegen-edges', 'tilegen-edges', 64, 64, 0, 0, 100);

    this.tilemap.map.setCollisionBetween(20,40);

    this.sprites = [];

    var grassTiles = this.mapGen.getTerrainIndexes('grass');
    var playerStart = grassTiles[Math.floor(Math.random()*grassTiles.length)]; 

    this.player = new Actors.Player(this);
    this.player.setPosition(playerStart.x * 64, playerStart.y * 64);
    this.add.existing(this.player);
    this.camera.focusOn(this.player);
    this.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);

    this.sprites.push(this.player);

    this.firstZombie = true;
    this.firstSoul = true;
    this.firstNothing = true;
    this.firstBeacon = true;

    this.holes = [];
    this.treasures = [];
    this.zombies = [];
    this.graves = [];
    this.headstones = [];

    this.plantGraves();
    this.plantTreasures();

    this.rain = new Environment.Rain(this.game, this.player.x, this.player.y);
    //this.add.existing(this.rain);

    this.vignette = new UI.Vignette(this.game, { id: 'screenfade' });
    this.add.existing(this.vignette);

    this.player.essence = new UI.Essence(this);
    this.add.existing(this.player.essence);

    this.narrative = new UI.Narrative(this);
    this.notifications = new UI.Notifications(this);
    this.add.existing(this.narrative);
    this.game.time.events.add(2000, function(){
        this.narrative.playChapter('intro');
    }, this);

    this.digCount = 0;

    //test zombie
    //this.spawnZombie(this.player);
};

GameScene.prototype.plantGraves = function(){
    var rooms = this.mapGen.getRegions();
    var perRoom = 2;

    var argosRoom = Math.floor(Math.random()*rooms.length);

    this.argosGrave = new Environment.DogGrave(
        this, 
        (rooms[argosRoom].x - 1 + rooms[argosRoom].width * 0.5) * 64,
        (rooms[argosRoom].y - 2 + rooms[argosRoom].height * 0.5) * 64
    );
    this.sprites.push(this.argosGrave);
    this.add.existing(this.argosGrave);
    this.graves.push(this.argosGrave.grave);

    var grave;

    for (var rdx = 0; rdx < rooms.length; rdx++){
        if (rdx == argosRoom) continue;
        var r = rooms[rdx];
        console.log(r);
        for (var pdx = 0; pdx < perRoom; pdx++){
            console.log('grave');
            grave = new Environment.Grave(
                this,
                (2 + r.x + Math.random() * (r.width - 4)) * 64,
                (2 + r.y + Math.random() * (r.height - 5)) * 64,
                this.expectation(this.config.graves)
            );
            this.graves.push(grave.grave);
            this.headstones.push(grave.headstone);
            this.sprites.push(grave);
            this.add.existing(grave);
        }
    }


    console.log(this.graves.length + " graves planted");
};

GameScene.prototype.plantTreasures = function(){
    var terrainArrays = {
        soil: this.mapGen.getTerrainIndexes('soil'),
        grass: this.mapGen.getTerrainIndexes('grass'),
        water: this.mapGen.getTerrainIndexes('water'),
        mud: this.mapGen.getTerrainIndexes('mud'),
        rock: this.mapGen.getTerrainIndexes('rock')
    };

    var treasure, terrain, tile;
    for(var type in this.config.treasures){
        for (var idx = 0; idx < this.config.treasures[type].num; idx++){
            terrain = this.expectation(this.config.treasures[type].terrain);
            tile = terrainArrays[terrain][Math.floor(Math.random()*terrainArrays[terrain].length)];
            treasure = new Environment.Treasure(
                this,
                tile.x * 64,
                tile.y * 64,
                type
            );
            this.treasures.push(treasure);
            this.sprites.push(treasure);
            this.add.existing(treasure);
        }
    }
    console.log(this.treasures.length + " treasures planted");
};

GameScene.prototype.showTreasures = function(){
    for(var idx = 0; idx < this.treasures.length; idx++){
        this.treasures[idx].showBeacon();
    }
};

GameScene.prototype.hideTreasures = function(){
    for(var idx = 0; idx < this.treasures.length; idx++){
        this.treasures[idx].hideBeacon();
    }
};

GameScene.prototype.update = function(){
    this.physics.arcade.collide(this.player, this.headstones);
    this.physics.arcade.collide(this.player, this.argosGrave.headstone);
    this.physics.arcade.collide(this.enemy, this.headstones);
    this.physics.arcade.collide(this.enemy, this.argosGrave.headstone);
    this.physics.arcade.collide(this.argosGrave.headstone, this.zombies);
    this.physics.arcade.collide(this.player, this.enemy, this.enemyAttack, null, this);
    this.physics.arcade.collide(this.player, this.zombies, this.enemyAttack, null, this);
    this.physics.arcade.collide(this.player, this.tilemap.layer);
    this.physics.arcade.collide(this.enemy, this.tilemap.layer, this.enemyTeleport, null, this);

    this.player.update();
    if(this.enemy) this.enemy.update();
    this.player.essence.update();
    this.resolveZ();

    if(this.player.essence.value <= 0){
        this.player.dieAnim();
        this.game.time.events.add(10000, function(){
            this.game.state.start('end-scene');
        }, this);
    }

    if(Math.abs(this.player.body.velocity.x) > 0 || Math.abs(this.player.body.velocity.y) > 0 || this.firstBeacon){
        this.hideTreasures();
    } else {
        this.showTreasures();
    }
};

GameScene.prototype.enemyAttack = function(player, enemy){
    enemy.attack(player);
};

GameScene.prototype.enemyTeleport = function(enemy) {
    enemy.teleport();
};

GameScene.prototype.destroy = function(){
    Scene.prototype.onDestroy.call(this);
    this.tilemap.destroy();
};

GameScene.prototype.resolveZ = function(){
    this.sprites.sort(function(a,b){
        var ay = 'headstone' in a ? a.y + a.headstone.body.offset.y: a.y;
        var by = 'headstone' in b ? b.y + b.headstone.body.offset.y: b.y;
        return ay - by;
    });

    for (var idx = 0; idx < this.sprites.length; idx++){
        if("onReorderZ" in this.sprites[idx]){
            this.sprites[idx].onReorderZ();
        } else {
            this.game.world.bringToTop(this.sprites[idx]);
        }
    }

    if(this.powerup) this.game.world.bringToTop(this.powerup);
    this.game.world.bringToTop(this.narrative);
    this.game.world.bringToTop(this.notifications);
    this.game.world.bringToTop(this.rain);
    this.game.world.bringToTop(this.vignette);
    this.game.world.bringToTop(this.player.essence);
};

GameScene.prototype.render = function(){
    //this.game.debug.body(this.player);
    //this.game.debug.body(this.enemy);
    //for (var idx = 0; idx < this.graves.length; idx++){
    //    this.game.debug.body(this.graves[idx]);
    //    this.game.debug.body(this.headstones[idx]);
    //}
    //for (var idx = 0; idx < this.zombies.length; idx++){
    //    this.game.debug.body(this.zombies[idx]);
    //}
    //
    //for (var idx = 0; idx < this.treasures.length; idx++){
    //    this.game.debug.body(this.treasures[idx]);
    //}
    //for (var idx = 0; idx < this.holes.length; idx++){
    //    this.game.debug.body(this.holes[idx]);
    //}
    //
    //this.game.debug.body(this.argosGrave.headstone);
    //this.game.debug.body(this.argosGrave.grave);
    this.player.onRender();
    this.player.essence.render();
};

GameScene.prototype.getDigArea = function(){
    var onGrave = false;
    this.game.physics.arcade.overlap(this.player, this.graves, function(player, grave){
        onGrave = grave;
    }, null, this);

    if (onGrave){
        if (this.digCount < 5){
            return null;
        }
        if (onGrave.frame == 1){
            return null;
        }
        return {
            type: "grave",
            grave: onGrave,
            time: DigTimes.grave
        };
    }

    var onHole = false
    this.game.physics.arcade.overlap(this.player, this.holes, function(player, hole){
        onHole = true;
    }, null, this);

    if (onHole) return null;

    // determine dynamically from terrain and contents
    var type = this.tilemap.getTerrainAt(this.player.body.x, this.player.body.y);
    console.log(type);

    var digArea = {
        type: type,
        reward: null,
        time: DigTimes[type]
    };

    this.game.physics.arcade.overlap(this.player, this.treasures, function(player, treasure){
        digArea.reward = treasure.contents;
    }, null, this);

    if (digArea.reward === null){
        if (Math.random() < DigChances[type][0]){
            digArea.reward = Math.random() < DigChances[type][1] ? "EvilSoul" : "BlessedSoul";
        }
    }

    // guarantee reward the first time
    if (this.digCount == 0){
        digArea.reward = "EvilSoul";
    }

    return digArea;
};

GameScene.prototype.completedDig = function(){
    switch(this.digCount){
        case 0:
            this.narrative.playChapter('firstpowerup');
            break;
        case 2:
            this.spawnGroundskeeper();
            this.narrative.playChapter('groundskeeper');
            break;
        case 4:
            this.narrative.playChapter('graves');
            break;
        case 8:
            this.beaconTutorial();
            break;
    }
    this.digCount++;

    var hole = new Environment.Hole(this, this.player.body.x, this.player.body.y);
    this.holes.push(hole);
    this.add.existing(hole);

    this.game.physics.arcade.overlap(this.player, this.treasures, function(player, treasure){
        treasure.kill();
        for (var idx = 0; idx < this.treasures.length; idx++){
            if (treasure == this.treasures[idx]){
                this.treasures.splice(idx, 1);
                break;
            }
        }
    }, null, this);
};

GameScene.prototype.openGrave = function(grave){
    grave.frame = 1;
    switch(grave.contents){
        case "zombie":
            this.spawnZombie(grave.grp);
            if(this.firstZombie){
                this.narrative.playChapter('zombie');
                this.firstZombie = false;
            };
            break;
        case "heart":
            this.spawnHeart(grave.grp);
            break;
        case "lostsoul":
            this.spawnLostSoul(grave.grp);
            if(this.firstSoul){
                this.narrative.playChapter('lostsoul');
                this.firstSoul = false;
            };
            break;
        case "argos":
            this.spawnArgos(grave.grp);
            //this.narrative.playChapter('argos');
            break;
        case "nothing":
            if(this.firstNothing){
                this.narrative.playChapter('nothing');
                this.firstNothing = false;
            }
    }
};

GameScene.prototype.beaconTutorial = function(){
    if (this.narrative.currentChapter !== null){
        return this.game.time.events.add(5000, this.beaconTutorial, this);
    }

    this.narrative.playChapter('beacons');

    this.game.time.events.add(5500, function(){
        var treasure = new Environment.Treasure(this, this.player.x + 200, this.player.y, 'Bones');
        this.treasures.push(treasure);
        this.sprites.push(treasure);
        this.add.existing(treasure);
        this.firstBeacon = false;
    }, this);
};

GameScene.prototype.spawnGroundskeeper = function(){
    this.enemy = new Actors.Enemy(this);
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

    this.light = new UI.Light(this, { radius: 400, id: 'lantern', color: '#ffff66' });
    this.light.attachTo(this.enemy);
    this.add.existing(this.light);
    this.sprites.push(this.enemy);
};


GameScene.prototype.spawnZombie = function(grave){
    var zombie = new Actors.Zombie(this);
    zombie.setTarget(this.player);
    zombie.setPosition(grave.x + 70, grave.y + 100);
    this.sprites.push(zombie);
    this.zombies.push(zombie);
    this.add.existing(zombie);
};

GameScene.prototype.spawnLostSoul = function(grave){
    var lostSoul = new Actors.LostSoul(this);
    lostSoul.setTarget(this.enemy);
    lostSoul.setPosition(grave.x + 70, grave.y + 100);
    this.sprites.push(lostSoul);
    this.add.existing(lostSoul);
};

GameScene.prototype.spawnHeart = function(grave){
    this.spawnPowerup(grave.x + 70, grave.y, 'Heart');
};

GameScene.prototype.spawnPowerup = function(x, y, type){
    this.powerup = new Powerups[type](this, x, y);
    this.add.existing(this.powerup);
    this.powerup.applyEffect(this.player);
    window.essence += this.powerup.benefit;
    if (this.powerup.label instanceof Array){
        this.notifications.addMessage("Found " +
            this.powerup.label[Math.floor(Math.random()*this.powerup.label.length)]
        );
    } else {
        this.notifications.addMessage("Found " + this.powerup.label);
    }
    this.notifications.addMessage(this.powerup.effect);
};

GameScene.prototype.spawnArgos = function(grave){
    this.argos = new Actors.Argos(this);
    this.argos.x = grave.x;
    this.argos.y = grave.y + 100;
    this.argos.setTarget(this.player);
    this.add.existing(this.argos);
};

GameScene.prototype.expectation = function(options){
    var sum = 0;
    var key;
    for (key in options){
        sum += options[key];
    }
    for (key in options){
        if (Math.random() < options[key]/sum){
            return key;
        } else {
            sum -= options[key];
        }
    }
};

module.exports = GameScene;
