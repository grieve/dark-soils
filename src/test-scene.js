var Scene = require('./scene');
var Tilemap = require('./tilemap');
var Player = require('./player');

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
    
    this.player = new Player(this.game);
    this.player.setPosition(this.game.width/2, this.game.height/2);
    this.game.add.existing(this.player.sprite);
};

TestScene.prototype.onUpdate = function(){
    this.player.update();
};

module.exports = TestScene;
