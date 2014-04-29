var Scene = require('./base');

var TitleScene = function(){
    Scene.prototype.constructor.call(this);
};

TitleScene.prototype = Object.create(Scene.prototype);
TitleScene.prototype.constructor = TitleScene;

TitleScene.prototype.create = function(){
    this.logo = this.add.sprite(this.width*0.5, this.height*0.5, 'title-text', 0);
    this.logo.anchor.setTo(0.5, 0.5);

    var style = {
        font: "18px Chewy",
        fill: "#cca",
        stroke: "#000",
        strokeThickness: 1,
        align: "center"
    };
    var totalTime = this.game.time.now - window.startTime;
    time = this.add.text(400, this.game.height*0.5 + 120, 'You survived ' + Math.round(totalTime/10)/100 + ' seconds', style);
    time.anchor.setTo(0.5);
    score = this.add.text(400, this.game.height*0.5 + 200, 'You collected ' + window.essence + ' essence', style);
    score.anchor.setTo(0.5);
    text = this.add.text(400, this.game.height*0.5 + 280, 'Hit Space to play again', style);
    text.anchor.setTo(0.5);
};

TitleScene.prototype.update = function(){
    this.logo.x = this.game.width*0.5 + Math.random()*10 - 5;
    this.logo.y = this.game.height*0.5 + Math.random()*10 - 5;

    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        this.game.nextLevel();
    }
};

module.exports = TitleScene;
