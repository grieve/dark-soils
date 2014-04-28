var Scene = require('./base');

var TitleScene = function(){
    Scene.prototype.constructor.call(this);
};

TitleScene.prototype = Object.create(Scene.prototype);
TitleScene.prototype.constructor = TitleScene;

TitleScene.prototype.create = function(){
    this.logo = this.add.sprite(this.width*0.5, this.height*0.5, 'title-text', 0);
    this.logo.anchor.setTo(0.5, 0.5);

    var style = {font: "25px Arial", fill: "#ccccad", align: "center"};
    text = this.add.text(400, this.game.height*0.5 + 100, 'Click to play', style);
    text.anchor.setTo(0.5);
};

TitleScene.prototype.update = function(){
    this.logo.x = this.game.width*0.5 + Math.random()*10 - 5;
    this.logo.y = this.game.height*0.5 + Math.random()*10 - 5;

    if (this.input.mousePointer.justReleased()){
        this.game.nextLevel();
    }
};

module.exports = TitleScene;
