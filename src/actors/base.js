var Phaser = require('phaser');

var Actor = function(scene, x, y, graphic){
    Phaser.Group.prototype.constructor.call(this, scene.game);
    this.sprite = new Phaser.Sprite(scene.game, 0, 0, graphic);
    this.x = x;
    this.y = y;
};

Actor.prototype = Object.create(Phaser.Group.prototype);
Actor.prototype.constructor = Actor;
