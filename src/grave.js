var Phaser = require('phaser');

var Grave = function(game, x, y, contents){
    Phaser.Sprite.call(this, game, x, y, 'grave', 0);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.game = game;
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
