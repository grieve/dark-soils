var _ = require('lodash');

var Scene = function(opts){
    this.game = opts.game;
    this.sprites = [];
};

Scene.prototype.onPreload = function(cb){
    if(cb) cb();
};

Scene.prototype.onCreate = function(){
};

Scene.prototype.onDestroy = function(){
    _.each(this.sprites, function(sprite){
        if(sprite) sprite.kill();
    });
};

module.exports = Scene;
