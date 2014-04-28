var Phaser = require('phaser');

var Treasure = function(scene, x, y, contents){
    Phaser.Sprite.call(this, scene.game, x, y, 'glow', 0);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.contents = contents;
    this.anchor.set(0.5, 0.5);

    this.animations.add('pulse', [0, 1, 2, 3], 15, true);
    this.play('pulse');
    this.showing = false;
    this.hiding = false;
    this.alpha = 0;
};

Treasure.prototype = Object.create(Phaser.Sprite.prototype);
Treasure.prototype.constructor = Treasure;

Treasure.prototype.showBeacon = function(){
    if (this.showing) return;
    if (this.tween) this.tween.stop();
    this.tween = this.game.add.tween(this)
        .to({alpha: 1}, 2000, false)
        .delay(2000);
    this.tween.onComplete.add(function(){
        this.showing = false;
    }, this);
    this.tween.start();
    this.hiding = false;
    this.showing = true;
};

Treasure.prototype.hideBeacon = function(){
    if (this.hiding) return;
    if (this.tween) this.tween.stop();
    this.tween = this.game.add.tween(this)
        .to({alpha: 0}, 1000, false);
    this.tween.onComplete.add(function(){
        this.hiding = false;
    }, this);
    this.tween.start();
    this.showing = false;
    this.hiding = true;
};

module.exports = Treasure;
