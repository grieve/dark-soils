var Scene = require('./scene');
var MapGen = require('./mapgen');

var MapTestScene = function(){
    Scene.prototype.constructor.call(this);
};

MapTestScene.prototype = Object.create(Scene.prototype);

MapTestScene.prototype.preload = function(){

};

MapTestScene.prototype.create = function(){
    var map = new MapGen();
    map.init();
    map.generate();

    var TILE_SIZE = 5;

    var terrainCols = [
        '#003399',  // water
        '#333300',  // mud
        '#472400',  // soil
        '#003300',  // ground
        '#494949',  // rock
        '#291400'   // grave
    ];

    for(var k in map.data) {
        var tile = map.data[k];
        var color = (tile.blocking) ? '#111111' : terrainCols[tile.terrain];
        this.game.debug.geom(new Phaser.Rectangle(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE), color);
    }
};

MapTestScene.prototype.update = function(){

};

module.exports = MapTestScene;
