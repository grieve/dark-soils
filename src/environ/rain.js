var Phaser = require('phaser');

var Rain = function(game, x, y){

    var rainImg = this._createRainImage();
    game.cache.addImage('rain', null, rainImg);

   // this.alpha = 0.6;

    var emitter = game.add.emitter(game.width / 2, 0, 400);

    emitter.width = game.width * 1.5;

    emitter.makeParticles('rain');

    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 0.5;

    emitter.setYSpeed(300, 500);
    emitter.setXSpeed(-20, -5);

    emitter.minRotation = 0;
    emitter.maxRotation = 0;

    emitter.fixedToCamera = true;

    emitter.start(false, 3000, 5, 0);

    console.log('emitter', emitter);

};

Rain.prototype = Object.create(Phaser.Sprite.prototype);
Rain.prototype.constructor = Rain;

Rain.prototype._createRainImage = function() {

    var c = document.createElement('canvas');
    c.width = 2, c.height=6;
    var ctx = c.getContext('2d');

    var grd = ctx.createLinearGradient(0,0,0,c.height-1);
    grd.addColorStop(0,"transparent");
    grd.addColorStop(0.5,"#A4ACB3");
    ctx.fillStyle = '#ffffff'; //grd;
    ctx.fillRect(0, 0, c.width, c.height);

    var cimg = new Image;
    cimg.src = c.toDataURL('image/png');
    return cimg;
}


module.exports = Rain;