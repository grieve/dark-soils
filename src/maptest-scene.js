var Scene = require('./scene');
var MapGen = require('./mapgen');

var MapTestScene = function(opts){
    Scene.prototype.constructor.call(this, opts);
};

MapTestScene.prototype = Object.create(Scene.prototype);

MapTestScene.prototype.onPreload = function(){

};

MapTestScene.prototype.onCreate = function(){
    var map = new MapGen();
    map.init();
    map.generate();

    var TILE_SIZE = 10;

    var terrainCols = [
        '#003399',  // water
        '#143D29',  // mud
        '#18140F',  // soil
        '#28321F',  // ground
        '#494949',  // rock
        '#291400'   // grave
    ];

    for(var k in map.data) {
        var tile = map.data[k];
        this.game.debug.geom(new Phaser.Rectangle(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE), terrainCols[tile.terrain]);
    }
};

MapTestScene.prototype.onUpdate = function(){

};

module.exports = MapTestScene;
