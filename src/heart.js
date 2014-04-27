var Phaser = require('phaser');

var Heart = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'heart', 0);
    this.game = game;
    this.anchor.set(0.5, 0.5);
    this.tween = game.add.tween(this).to({y: y-100}, 1200, Phaser.Easing.Quadratic.Out, false);
    this.tween.onComplete.add(function(){
        this.kill();
        this.destroy();
    }, this);
    this.tween.start();
};

Heart.prototype = Object.create(Phaser.Sprite.prototype);
Heart.prototype.constructor = Heart;

module.exports = Heart;
