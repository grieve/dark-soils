var Phaser = require('phaser');

var Script = require('./script');

var Narrative = function(scene){
    Phaser.Group.prototype.constructor.call(this, scene.game);
    this.scene = scene;
    this.currentLine = 0;
    this.currentChapter = [];

    this.style = {
        font: "16px Chewy",
        fill: "#cca",
        stroke: "#000",
        strokeThickness: 1,
        align: "left",
        wordWrap: true,
        wordWrapWidth: 500
    };
};

Narrative.prototype = Object.create(Phaser.Group.prototype);
Narrative.prototype.constructor = Narrative;

Narrative.prototype.playChapter = function(name){
    this.currentChapter = Script[name];
    this.writeLine();
};

Narrative.prototype.writeLine = function(){
    var script = this.currentChapter[this.currentLine];
    var line = new Phaser.Text(
        this.game,
        this.scene.player.x - 30,
        this.scene.player.y + 100,
        script[1],
        this.style
    );

    line.setShadow(2, 2, "rgba(0, 0, 0, 0.5)", 1);
    line.alpha = 0;
    this.game.add.tween(line)
        .to({alpha: 1, y: line.y - 20}, 750, Phaser.Easing.Quadratic.out)
        .to({alpha: 1, y: line.y - 20}, script[0], Phaser.Easing.Quadratic.out)
        .to({alpha: 0, y: line.y - 40}, 750, Phaser.Easing.Quadratic.out)
        .start();
    this.currentLine++;
    if (this.currentLine == this.currentChapter.length){
        this.currentLine = 0;
        this.currentChapter = [];
    } else {
        this.game.time.events.add(1500 + script[0] + script[2], this.writeLine, this);
    }

    this.add(line);
};

module.exports = Narrative;
