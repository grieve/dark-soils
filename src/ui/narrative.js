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
};

Narrative.prototype = Object.create(Phaser.Group.prototype);
Narrative.prototype.constructor = Narrative;

Narrative.prototype.playChapter = function(name){
    this.game.time.events.remove(this.timer);
    this.currentChapter = Script[name];
    this.currentLine = 0;
    this.writeLine();
};

Narrative.prototype.writeLine = function(){
    var script = this.currentChapter[this.currentLine++];
    var insev = script.severity;
    var outsev = script.severity;
    if (this.currentLine == this.currentChapter.length){
        this.timer = this.game.time.events.add(2000 + script.duration, this.reset, this);
        outsev = 30;
    } else {
        if (this.currentLine == 1){
            insev = 10;
        }
        this.timer = this.game.time.events.add(2000 + script.duration, this.writeLine, this);
    }

    if (this.line) this.line.destroy();
    this.line = new Phaser.Text(
        this.game,
        this.scene.player.x,
        this.scene.player.y,
        script.line,
        this.style
    );

    this.line.setShadow(2, 2, "rgba(0, 0, 0, 0.5)", 1);
    this.line.alpha = 0;
    this.line.severity = insev;
    this.game.add.tween(this.line)
        .to({alpha: 1, severity: script.severity}, 750, Phaser.Easing.Quadratic.in)
        .to({alpha: 1}, script.duration, Phaser.Easing.Quadratic.out)
        .to({alpha: 0, severity: outsev}, 1000, Phaser.Easing.Quadratic.out)
        .start();

    this.add(this.line);
};

Narrative.prototype.update = function(){
    if(this.line){
        this.line.x = this.scene.player.x + Math.random() * this.line.severity;
        this.line.y = this.scene.player.y - 70 + Math.random() * this.line.severity - this.line.height;
    }
};

Narrative.prototype.reset = function(){
    this.currentLine = 0;
    this.currentChapter = null;
};

module.exports = Narrative;
