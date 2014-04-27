var Phaser = require('phaser');

var Light = function(game, opts){

    var limg = this._createLightImage(opts);
    game.cache.addImage(opts.id, null, limg);

    Phaser.Sprite.call(this, game, 0, 0, opts.id, 0);

    this.flickerAmount = opts.flickerAmount || 0;
    this.flickerRange = opts.flickerRange || 0;

    this.alpha = 0.6;
    this.blendMode = 1;
    this.anchor.setTo(0.5, 0.5);

};

Light.prototype = Object.create(Phaser.Sprite.prototype);
Light.prototype.constructor = Light;

Light.prototype.update = function() {

    if(this.attachedTo) {
        this.x = this.attachedTo.x;
        this.y = this.attachedTo.y;
    }
    // todo: flicker

}

Light.prototype.attachTo = function(actor) {

    this.attachedTo = actor;

}

Light.prototype._createLightImage = function(opts) {

    var c = document.createElement('canvas');
    c.width = c.height = opts.radius * 2;
    var ctx = c.getContext('2d');

    // make gradient
    var grd=ctx.createRadialGradient(opts.radius,opts.radius,10,opts.radius,opts.radius,opts.radius-10);
    grd.addColorStop(0,opts.color || '#ffffff');
    grd.addColorStop(1,"transparent");
    ctx.fillStyle=grd;
    ctx.fillRect(0,0,opts.radius*2,opts.radius*2);

    var cimg = new Image;
    cimg.src = c.toDataURL('image/png');
    return cimg;

}

module.exports = Light;