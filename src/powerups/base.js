var Phaser = require('phaser');

var Powerup = function(scene, x, y){
    Phaser.Group.prototype.constructor.call(this, scene.game);
    var image = new Phaser.Sprite(scene.game, x, y+50, this.graphic, 0);
    image.anchor.set(0.5, 0.5);
    image.scale.x = image.scale.y = 0.3;
    this.add(image);
    this.tween = this.game.add.tween(image).to({y: y-20}, 3000, Phaser.Easing.Quadratic.Out, false);
    this.game.add.tween(image.scale).to({x: 0.6, y: 0.6}, 3000, Phaser.Easing.Quadratic.Out, true);
    this.tween.onComplete.add(function(){
        this.destroy(true);
    }, this);
    this.tween.start();
};

Powerup.prototype = Object.create(Phaser.Group.prototype);
Powerup.prototype.constructor = Powerup;

Powerup.prototype.applyEffect = function(player){
    player.essence.value += this.benefit;
};

Powerup.prototype.benefit = 1000;
Powerup.prototype.effect = "+1000 essence";
Powerup.prototype.label = "a sacred relic";

module.exports = Powerup;
