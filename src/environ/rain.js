var Phaser = require('phaser');

var Rain = function(game){

    var rainImg = this._createRainImage();
    game.cache.addImage('rain', null, rainImg);

   // this.alpha = 0.6;

    var emitter = game.add.emitter(game.width/2, 0, 400);

    emitter.width = game.width;

    emitter.makeParticles('rain');

    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 0.5;

    emitter.setYSpeed(300, 500);
    emitter.setXSpeed(-5, 5);

    emitter.minRotation = 0;
    emitter.maxRotation = 0;

    emitter.start(false, 1600, 5, 0);

    console.log('emitter', emitter);

};

Rain.prototype = Object.create(Phaser.Sprite.prototype);
Rain.prototype.constructor = Rain;

Rain.prototype._createRainImage = function() {

    var c = document.createElement('canvas');
    c.width = 1, c.height=3;
    var ctx = c.getContext('2d');

    var grd = ctx.createLinearGradient(0,0,0,c.height-1);
    grd.addColorStop(0,"transparent");
    grd.addColorStop(1,"#A4ACB3");
    ctx.fillStyle = '#ffffff'; //grd;
    ctx.fillRect(0, 0, c.width, c.height);

    var cimg = new Image;
    cimg.src = c.toDataURL('image/png');
    return cimg;
}


module.exports = Rain;