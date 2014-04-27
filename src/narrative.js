var Phaser = require('phaser');

var Script = require('./script');

var Narrative = function(scene){
    Phaser.Group.prototype.constructor.call(this, scene.game);
    this.scene = scene;
    this.currentLine = 0;
    this.currentChapter = null;

    this.style = {
        font: "16px Chewy",
        fill: "#cca",
        stroke: "#000",
        strokeThickness: 1,
        align: "center",
        wordWrap: true,
        wordWrapWidth: 250
    };

    this.severity = 1;
};

Narrative.prototype = Object.create(Phaser.Group.prototype);
Narrative.prototype.constructor = Narrative;

Narrative.prototype.playChapter = function(name){
    console.log(name);
    this.game.time.events.remove(this.timer);
    this.currentChapter = Script[name];
    console.log(this.currentChapter);
    this.currentLine = 0;
    this.writeLine();
};

Narrative.prototype.writeLine = function(){
    var script = this.currentChapter[this.currentLine];
    if (this.line) this.line.destroy();
    this.line = new Phaser.Text(
        this.game,
        this.scene.player.x + 120,
        this.scene.player.y - 120,
        script[2],
        this.style
    );

    console.log(script[2]);

    this.line.setShadow(2, 2, "rgba(0, 0, 0, 0.5)", 1);
    this.line.alpha = 0;
    this.game.add.tween(this.line)
        .to({alpha: 1}, 750, Phaser.Easing.Quadratic.out)
        .to({alpha: 1}, script[1], Phaser.Easing.Quadratic.out)
        .to({alpha: 0}, 750, Phaser.Easing.Quadratic.out)
        .start();
    this.currentLine++;
    if (this.currentLine == this.currentChapter.length){
        this.timer = this.game.time.events.add(1500 + script[1] + script[3], this.reset, this);
    } else {
        this.timer = this.game.time.events.add(1500 + script[1] + script[3], this.writeLine, this);
    }

    this.severity = script[0];
    this.add(this.line);
};

Narrative.prototype.update = function(){
    if(this.line){
        this.line.x = this.scene.player.x - 30 + Math.random() * this.severity;
        this.line.y = this.scene.player.y - 120 + Math.random() * this.severity;
    }
};

Narrative.prototype.reset = function(){
    this.currentLine = 0;
    this.currentChapter = null;
};

module.exports = Narrative;
