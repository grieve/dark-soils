var _ = require('lodash');
var Phaser = require('phaser');
var ROT = require('rot');

var MAP_SIZE = 64,

MIN_ROOMS = 6,
MAX_ROOMS = 12,
ROOM_SIZE_MIN = 6,
ROOM_SIZE_MAX = 36,

TILE_SIZE = 64,

TERRAIN_NUM_AREAS = 40;

var terrainTypes = [
    { name: 'water', tile: 5, min: -1, max: -0.9},
    { name: 'mud', tile: 4, min: -0.98, max: -0.7},
    { name: 'soil',  tile: 3, min: -0.69, max: -0.5},
    { name: 'ground', tile: 1, min: -0.4, max:0.6},
    { name: 'rock', tile: 2, min: 0.61, max:0.9},
    //{ name: 'grave', tile: 6, min: 0.91, max: 1}
];


var c = function(x, y) {
    return 'x' + x + 'y' + y;
};

var rndInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var lineDistance = function( point1, point2 ) {

  var xs = 0, ys = 0;

  xs = point2.x - point1.x;
  xs = xs * xs;
  ys = point2.y - point1.y;
  ys = ys * ys;

  return Math.sqrt( xs + ys );

}

var rndFloat = function(min, max) {
    return Math.random() * (max - min) + min;
}

var MapTile = function(opts) {

    this.x = opts.x;
    this.y = opts.y;
    this.terrain = opts.terrain;

    this.blocking = opts.blocking || false;

};

var MapGen = function(opts){

    this.size = MAP_SIZE;
    this.init();

};

MapGen.prototype.init = function() {

    this.data = {};

};

/**
 * Create a series of terrain regions using super-hacky sub-Voronori logic.
 * Procedural generation is hard when you're still hung over.
 */
MapGen.prototype.generateTerrain = function() {

    console.log('generateTerrain');

    // create a series of randomly distributed grid floats
    var points = _createRegionPoints(MAP_SIZE, MAP_SIZE, TERRAIN_NUM_AREAS);

    // now assign a random terrain type to each region spawn point
    for(var i = 0; i < points.length; i++) {
        points[i].terrain = rndInt(0, terrainTypes.length - 1);
    }

    console.log('generateTerrain: points', points);

    // loop the grid and assign the terrain type of the closest region to each tile
    for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {

            var closest, closestDist = 9999999;

            for (var i = 0; i < TERRAIN_NUM_AREAS; i++) {

                var dist = lineDistance({
                    x: parseFloat(x + '.5'),
                    y: parseFloat(y + '.5')
                }, points[i]);

                if (dist < closestDist) {
                    closest = points[i];
                    closestDist = dist;
                }

            }

            this.data[c(x,y)] = new MapTile({
                x: x,
                y: y,
                terrain: closest.terrain
            });
        }
    }

    console.log('generateTerrain: complete', this.data);

};

var _createRegionPoints = function(w, h, numRegions) {

    var points = [];
    for (var i = 0; i < numRegions; i++) {
        points.push({
            id: i,
            x: rndFloat(0, w),
            y: rndFloat(0, h)
        });
    }
    return points;

};

var checkOverlap = function(x1, y1, w1, h1, x2, y2, w2, h2) {

    return !(x2 > x1 + w1 ||
           x2 + w2 < x1 ||
           y2 > y1 + h1 ||
           y2 + h2 < y1);

};

MapGen.prototype.generateROTMap = function() {

    var map = new ROT.Map.Digger(this.size, this.size, {
        roomWidth: [ROOM_SIZE_MIN, ROOM_SIZE_MAX],
        roomHeight: [ROOM_SIZE_MIN, ROOM_SIZE_MAX],
        dugPercentage: 0.9,
        timeLimit: 4000
    });
    var self = this;
    map.create(function(x, y, v) {
        self.data[c(x,y)].blocking = v;
    });


};

MapGen.prototype.generate = function() {
    this.generateTerrain();
    //this.generateROTMap();
};

MapGen.prototype.exportJSON = function() {

    var exp = {};
    exp.height = exp.width = this.size;
    exp.orientation = 'orthogonal';
    exp.tileHeight = exp.tileWidth = TILE_SIZE;
    exp.version = 1;
    exp.properties = {};
    exp.layers = [];

    // tileset setup
    exp.tilesets = [];

    // terrain
    var terrainLayer = {};
    terrainLayer.height = terrainLayer.width = this.size;
    terrainLayer.opacity = 1;
    terrainLayer.type = 'tilelayer';
    terrainLayer.name = 'Terrain Layer 1';
    terrainLayer.visible = true;
    terrainLayer.x = terrainLayer.y = 0;
    terrainLayer.data = [];

    for(var x = 0; x < this.size; x++) {
        for(var y = 0; y < this.size; y++) {
            var tile = this.data[c(x,y)];
            var tid = tile.terrain; //(tile.blocking) ? null : tile.terrain;
            terrainLayer.data.push(tid);
        }
    }

    exp.layers.push(terrainLayer);

    console.log('exported', exp);

    return exp;

};

MapGen.prototype.exportCSV = function() {

    var exp = '';

    for(var y = 0; y < this.size; y++) {
        var row = [];
        for(var x = 0; x < this.size; x++) {
            var tile = this.data[c(x,y)];
            var tid = (tile.blocking) ? 0 : terrainTypes[tile.terrain].tile;
            row.push(tid);
        }
        exp += row.join(',') + '\n';
    }
    console.log('exported', exp);
    return exp;

}


module.exports = MapGen;
