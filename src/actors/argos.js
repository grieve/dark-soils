var Phaser = require('phaser');

var Argos = function(scene){
    Phaser.Sprite.call(this, scene.game, 0, 0, 'argos', 0);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.scale.x = this.scale.y = this.baseScale = 0.6;
    this.anchor.setTo(0.5, 0.5);
    this.catchSpeed = 300;
    this.searchSpeed = 160;
    this.searchRadius = 500;
    this.speed = 10;
    this.alpha = 0.5;
    this.currentAction = "catching";
    this.scene = scene;

    this.animations.add('waft', [0, 1, 2, 3], 12, true);
    this.animations.add('sniff', [8, 9, 10, 11, 12, 13, 14, 15], 12, true);
    this.animations.add('bark', [16, 17, 18, 19, 20, 21, 22], 12, true);
    this.animations.add('grimace', [16, 17, 18, 19], 12, true);
    this.play('waft');
};

Argos.prototype = Object.create(Phaser.Sprite.prototype);
Argos.prototype.constructor = Argos;

Argos.prototype.setPosition = function(x, y){
    this.x = x;
    this.y = y;
};

Argos.prototype.setTarget = function(obj){
    this.target = obj;
};

Argos.prototype.update = function(){
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    switch(this.decideAction()){
        case "catch":
            this.followPlayer();
            break;
        case "search":
            this.searchForTreasure();
            break;
        case "found":
            this.startSniffing();
            break;
        case "hide":
            this.fadeAway();
            break;
    }
    this.resolveAnimation();
};

Argos.prototype.decideAction = function(){
    if (!this.currentActionResolved()){
        return;
    }

    var action = null;

    var delta = {
        x: this.target.x - this.x,
        y: this.target.y - this.y + 5
    };

    if (Math.abs(delta.x) > 500 || Math.abs(delta.y) > 320){
        this.currentAction = "catching";
        this.play('waft');
        return "catch";
    }
    
    this.game.physics.arcade.overlap(this, this.scene.zombies, function(me, them){
        action = "hide";        
    });

    this.game.physics.arcade.overlap(this, this.scene.enemy, function(me, them){
        action = "hide";        
    });

    this.game.physics.arcade.overlap(this, this.scene.treasures, function(me, them){
        action = "found";        
    });


    return action || "search";

};

Argos.prototype.currentActionResolved = function(){
    if (!this.currentAction) return true;

    switch(this.currentAction){
        case 'catching':
            if (this.overlap(this.target)){
                this.currentAction = null;
                return true;
            } else {
                this.followPlayer();
                return false;
            }
            break;
        case 'gotoSearch':
            if (this.body.hitTest(this.gotoPoint.x, this.gotoPoint.y)){
                for(var idx = 0; idx < this.scene.graves.length; idx ++){
                    if (this.overlap(this.scene.graves[idx])){
                        return this.searchForTreasure();
                    }
                }
                this.startSniffing();
            } else {
                this.moveToPoint();
            }
            return false;
            break;
        case 'searching':
            return false;
            break;
        case 'barking':
            if (this.overlap(this.target)){
                this.currentAction = null;
                this.game.time.events.remove(this.barkTimer);
                return true;
            } else {
                return false;
            }
            break;
    };
};

Argos.prototype.searchForTreasure = function(){
    this.currentAction = 'gotoSearch';
    this.play('waft');

    this.gotoPoint = {
        x: this.target.x + (Math.random() - 0.5) * this.searchRadius,
        y: this.target.y + (Math.random() - 0.5) * this.searchRadius
    };
};


Argos.prototype.startSniffing = function(){
    this.currentAction = "searching";
    this.play('sniff');
    this.game.time.events.add(2500, function(){
        this.checkFoundTreasure();
    }, this);
};


Argos.prototype.checkFoundTreasure = function(sniff){
    for(var idx = 0; idx < this.scene.treasures.length; idx ++){
        if (this.overlap(this.scene.treasures[idx])){
            this.play('bark');
            this.barkTimer = this.game.time.events.add(5000, function(){
                this.currentAction = null;
            }, this);
            return this.currentAction = "barking";
        }
    }
    return this.currentAction = null;
};

Argos.prototype.followPlayer = function(){
    this.moveTowards(this.target.x, this.target.y, this.catchSpeed);
};

Argos.prototype.moveToPoint = function(){
    this.moveTowards(this.gotoPoint.x, this.gotoPoint.y, this.searchSpeed);
};

Argos.prototype.moveTowards = function(x, y, speed){
    var delta = {
        x: x - this.x,
        y: y - this.y + 5
    };

    var total = Math.abs(delta.x) + Math.abs(delta.y);
    var ratio = {
        x: delta.x/total,
        y: delta.y/total
    };
    this.body.velocity.x = speed * ratio.x;
    this.body.velocity.y = speed * ratio.y;
};

Argos.prototype.resolveAnimation = function(){
    if (this.body.velocity.x > 0){
        this.scale.x = this.baseScale;
    } else if(this.body.velocity.x < 0){
        this.scale.x = -this.baseScale;
    }
};

module.exports = Argos;
