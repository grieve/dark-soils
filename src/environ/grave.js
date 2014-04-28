var Phaser = require('phaser');

var Grave = function(scene, x, y, contents){
    Phaser.Group.prototype.constructor.call(this, scene.game);
    this.contents = contents;
    this.x = x;
    this.y = y;
    this.scale.x = this.scale.y = 0.6;

    this.grave = new Phaser.Sprite(scene.game, 0, 0, 'grave', 0);
    this.game.physics.enable(this.grave, Phaser.Physics.ARCADE);
    this.grave.body.setSize(60, 122);
    this.grave.body.offset.x = 28;
    this.grave.body.offset.y = 50;
    this.grave.body.immovable = true;
    this.grave.alpha = 0;
    this.add(this.grave);

    this.headstone = new Phaser.Sprite(scene.game, 0, 0, 'grave', 0);
    this.game.physics.enable(this.headstone, Phaser.Physics.ARCADE);
    this.headstone.body.setSize(70, 12);
    this.headstone.body.offset.x = 23;
    this.headstone.body.offset.y = 34;
    this.headstone.body.immovable = true;
    this.add(this.headstone);
};

Grave.prototype = Object.create(Phaser.Group.prototype);
Grave.prototype.constructor = Grave;

Grave.prototype.open = function(){
    this.frame = 1;
    console.log(this.contents);
};

module.exports = Grave;
