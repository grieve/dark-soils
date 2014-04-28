var Phaser = require('phaser');

var Grave = function(scene, x, y){
    Phaser.Group.prototype.constructor.call(this, scene.game);
    this.x = x;
    this.y = y;
    this.scale.x = this.scale.y = 0.9;

    this.grave = new Phaser.Sprite(scene.game, 0, 0, 'dog-grave', 0);
    this.game.physics.enable(this.grave, Phaser.Physics.ARCADE);
    this.grave.body.setSize(66, 70);
    this.grave.body.offset.x = 35;
    this.grave.body.offset.y = 158;
    this.grave.body.immovable = true;
    this.grave.contents = this.contents = 'argos';
    this.grave.grp = this;
    this.add(this.grave);

    this.headstone = new Phaser.Sprite(scene.game, 0, 0, 'dog-grave', 0);
    this.game.physics.enable(this.headstone, Phaser.Physics.ARCADE);
    this.headstone.body.setSize(66, 54);
    this.headstone.body.offset.x = 35;
    this.headstone.body.offset.y = 106;
    this.headstone.body.immovable = true;
    this.headstone.alpha = 0;
    this.add(this.headstone);
};

Grave.prototype = Object.create(Phaser.Group.prototype);
Grave.prototype.constructor = Grave;

Grave.prototype.open = function(){
    this.grave.frame = 1;
    console.log(this.contents);
};

module.exports = Grave;
