var Phaser = require('phaser');

var Player = function(scene){
    Phaser.Sprite.call(this, scene.game, 0, 0, 'player', 0);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(this.width*0.4, this.height*0.35, 0, this.height*0.2);
    this.scale.x = this.scale.y = this.baseScale = 0.6;
    this.anchor.setTo(0.5, 0.5);

    this.maxSpeed = 5;
    this.acceleration  = 30;
    this.damping = 1.15;

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.actionButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.digEmitter = this.game.add.emitter(0, 0, 1000);
    this.digEmitter.setXSpeed(-120, 120);
    this.digEmitter.setYSpeed(-160, -120);
    this.digEmitter.gravity = 300;

    this.scene = scene;

    this.timeSegment = this.game.add.sprite(0, 0, 'timer', 0);
    this.timeSegment.kill();

    this.animations.add('stand', [0], 12, true);
    this.animations.add('walk', [0, 1, 2, 3, 4, 5], 15, true);
    this.animations.add('dig', [6], 12, true);
    this.play('stand');
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.setPosition = function(x, y){
    this.x = x;
    this.y = y;
};

Player.prototype.update = function(){
    this.handleInput();
    this.updateSpeed();
    this.resolveAnimations();

    this.timeSegment.x = this.x + 30;
    this.timeSegment.y = this.y - 30;

};

Player.prototype.handleInput = function(){
    if (!this.digging){
        this.walking = false;
        if(this.cursors.down.isDown){
            this.body.velocity.y += this.acceleration;
            this.walking = true;
        }
        if(this.cursors.up.isDown){
            this.body.velocity.y -= this.acceleration;
            this.walking = true;
        }
        if(this.cursors.right.isDown){
            this.body.velocity.x += this.acceleration;
            this.scale.x = this.baseScale;
            this.walking = true;
        }
        if(this.cursors.left.isDown){
            this.body.velocity.x -= this.acceleration;
            this.scale.x = -this.baseScale;
            this.walking = true;
        }
    }

    if(this.actionButton.justPressed(30)){
        if (!this.digging){
            this.startDig();
        }
    }
    if(this.actionButton.justReleased(30)){
        this.stopDig();
    }

    if(this.digging){
        this.dig();
    }
};

Player.prototype.updateSpeed = function(){
    this.body.velocity.x /= this.damping;
    this.body.velocity.y /= this.damping;

    if (Math.abs(this.body.velocity.x) < 0.01){
        this.body.velocity.x = 0;
    }

    if (Math.abs(this.body.velocity.y) < 0.01){
        this.body.velocity.y = 0;
    }
};

Player.prototype.resolveAnimations = function(){
    if (this.digging){
        return this.play('dig');
    }
    if (this.walking){
        return this.play('walk');
    } else {
        return this.play('stand');
    }
};

Player.prototype.startDig = function(){

    this.digArea = this.scene.getDigArea();
    if (!this.digArea){
        return;
    }
    this.digTimer = this.game.time.events.add(this.digArea.time, this.finishDig, this);

    this.digging = true;
    var particleMap = {
        'grass': [0, 1, 2, 3, 4],
        'grave': [10, 10, 10, 11, 11, 11, 12, 13, 14]
    };
    this.digEmitter = this.game.add.emitter(0, 0, 1000);
    this.digEmitter.setXSpeed(-120, 120);
    this.digEmitter.setYSpeed(-160, -120);
    this.digEmitter.gravity = 300;
    this.digEmitter.makeParticles('particle-map', particleMap[this.digArea.type]);
    this.digEmitter.start(false, 1000, 10);

    this.timeSegment.revive();
    this.timeSegment.frame = 0;
};

Player.prototype.stopDig = function(){
    this.game.time.events.remove(this.digTimer);
    this.digEmitter.on = false;
    var oldEmitter = this.digEmitter;
    this.game.time.events.add(1000, function(){ oldEmitter.destroy();}, this);
    this.digging = false;
    this.timeSegment.kill();
};

Player.prototype.finishDig = function(){
    if(this.digArea.type == "grave"){
        this.scene.openGrave(this.digArea.grave);
    } else {
        if (this.digArea.reward !== null){
            this.scene.spawnPowerup(this.x, this.y-80, this.digArea.reward);
        }
    }
    this.scene.completedDig();
    this.stopDig();
};

Player.prototype.dig = function(){
    var complete = (this.digArea.time - (this.digTimer.tick - this.game.time.now)) / this.digArea.time;
    var frame = Math.floor(complete*8);
    this.timeSegment.frame = frame;
    this.digEmitter.x = this.body.x + this.body.width / 2;
    this.digEmitter.y = this.body.y + this.body.height / 2;
};

Player.prototype.onReorderZ = function(){
    if(this.digEmitter){
        this.game.world.bringToTop(this.digEmitter);
    }
    this.bringToTop();
    this.timeSegment.bringToTop();
};

Player.prototype.onRender = function(){

};

module.exports = Player;
