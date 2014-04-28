var Phaser = require('phaser'); 

var Notifications = function(scene){
    Phaser.Group.prototype.constructor.call(this, scene.game);
    this.scene = scene;

    this.style = {
        font: "16px Chewy",
        fill: "#cca",
        stroke: "#000",
        strokeThickness: 1,
        align: "center",
        wordWrap: true,
        wordWrapWidth: 250
    };

    this.messages = [];
    this.running = false;
};

Notifications.prototype = Object.create(Phaser.Group.prototype);
Notifications.prototype.constructor = Notifications;

Notifications.prototype.addMessage = function(message, override){
    if (override){
        this.messages.unshift(message);
    } else {
        this.messages.push(message);
    }
    console.log(this.running);
    if(!this.running || override){
        this.running = true;
        this.writeLine();
    }
};

Notifications.prototype.writeLine = function(){
    var message = this.messages.shift();

    this.timer = this.game.time.events.add(3000, function(){
        if(this.messages.length > 0) {
            this.writeLine();
        } else {
            this.running = false;
        }
    }, this);

    if (this.line) this.line.destroy();
    this.line = new Phaser.Text(
        this.game,
        this.scene.player.x - 70,
        this.scene.player.y + 70,
        message,
        this.style
    );

    this.line.setShadow(2, 2, "rgba(0, 0, 0, 0.5)", 1);
    this.line.alpha = 0;
    this.line.severity = 10;
    this.game.add.tween(this.line)
        .to({alpha: 1, severity: 1}, 500, Phaser.Easing.Quadratic.in)
        .to({alpha: 1}, 1750, Phaser.Easing.Quadratic.out)
        .to({alpha: 0, severity: 10}, 750, Phaser.Easing.Quadratic.out)
        .start();

    this.add(this.line);
};

Notifications.prototype.update = function(){
    if(this.line){
        this.line.x = this.scene.player.x + Math.random() * this.line.severity - this.line.width;
        this.line.y = this.scene.player.y + 70 + Math.random() * this.line.severity;
    }
};


module.exports = Notifications;
