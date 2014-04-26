var Scene = require('./scene');
var Tilemap = require('./tilemap');

var TestScene = function(opts){
    Scene.prototype.constructor.call(this, opts);
};

TestScene.prototype = Object.create(Scene.prototype);

TestScene.prototype.onCreate = function(){
   var tilemap = new Tilemap({
        game: this.game,
        map: "test-map",
        tileWidth: 40,
        tileHeight: 40,
        tileset: 'test-tilemap'
   });
};

TestScene.prototype.onUpdate = function(){
};

module.exports = TestScene;
