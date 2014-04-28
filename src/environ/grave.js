var Phaser = require('phaser');

var Grave = function(scene, x, y, contents){
    Phaser.Sprite.call(this, scene.game, x, y, 'grave', 0);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.contents = contents;
    this.anchor.set(0.5, 0.15);

    this.body.setSize(this.width*0.6, this.height * 0.1);
    this.body.immovable = true;
};

Grave.prototype = Object.create(Phaser.Sprite.prototype);
Grave.prototype.constructor = Grave;

Grave.prototype.open = function(){
    this.frame = 1;
    console.log(this.contents);
};

module.exports = Grave;
