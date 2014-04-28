var Phaser = require('phaser');

var Vignette = function(game, opts){

    console.log('Make screen vignette...');
    var limg = this._createGradient(game.width);
    game.cache.addImage(opts.id, null, limg);

    Phaser.Sprite.call(this, game, 0, 0, opts.id, 0);

    this.alpha = 0.8;
    this.fixedToCamera = true;

};

Vignette.prototype = Object.create(Phaser.Sprite.prototype);
Vignette.prototype.constructor = Vignette;

Vignette.prototype.update = function() {

}

Vignette.prototype._createGradient = function(size) {

    var c = document.createElement('canvas');
    c.width = c.height = size;
    var ctx = c.getContext('2d');

    // make gradient
    var cx = size / 2, cy = size / 2;
    var grd=ctx.createRadialGradient(cx, cy, size * 0.2, cx, cy, size * 0.7);
    grd.addColorStop(0,"transparent");
    grd.addColorStop(0.8,"#00050F");
    ctx.fillStyle=grd;
    ctx.fillRect(0,0, size, size);

    var cimg = new Image;
    cimg.src = c.toDataURL('image/png');
    return cimg;

}

module.exports = Vignette;