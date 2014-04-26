var Scene = require('./scene');

var LogoScene = function(opts){
    Scene.prototype.constructor.call(this, opts);
};

LogoScene.prototype = Object.create(Scene.prototype);

LogoScene.prototype.onCreate = function(){
    this.logo = this.game.add.sprite(this.game.width*0.5, this.game.height*0.5, 'title');
    this.logo.anchor.setTo(0.5, 0.5);
    this.sprites.push(this.logo.sprite);

    var style = {font: "25px Arial", fill: "#ccccad", align: "center"};
    text = this.game.add.text(400, 350, 'Click to play', style);
    text.anchor.setTo(0.5);
};

LogoScene.prototype.onUpdate = function(){
    this.logo.x = this.game.width*0.5 + Math.random()*10 - 5;
    this.logo.y = this.game.height*0.5 + Math.random()*10 - 5;

    if (this.game.input.mousePointer.justReleased()){
        this.game.transitionScene('test');
    }
};

module.exports = LogoScene;
