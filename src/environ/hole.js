var Phaser = require('phaser');

var Hole = function(scene, x, y){
    Phaser.Sprite.call(this, scene.game, x, y, 'hole', 0);
    this.scale.x = this.scale.y = 0.5;
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(140, 70);
    this.anchor.set(0.5, 0.5);
};

Hole.prototype = Object.create(Phaser.Sprite.prototype);
Hole.prototype.constructor = Hole;

module.exports = Hole;
