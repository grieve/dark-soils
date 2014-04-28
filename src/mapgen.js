var _ = require('lodash');
var Phaser = require('phaser');
var BSPNode = require('./libs/bsp');

/**
 * Config constants
 */

var MAP_SIZE = 64,

MIN_REGION_SIZE = 10,
TILE_SIZE = 64,
MAX_RECURSIONS = 4,
TERRAIN_NUM_AREAS = 40;

var terrainTypes = [
    { name: 'water', tile: 5, min: -1, max: -0.9},
    { name: 'mud', tile: 4, min: -0.98, max: -0.7},
    { name: 'soil',  tile: 3, min: -0.69, max: -0.5},
    { name: 'ground', tile: 1, min: -0.4, max:0.6},
    { name: 'rock', tile: 2, min: 0.61, max:0.9},
    //{ name: 'grave', tile: 6, min: 0.91, max: 1}
];

/**
 * Util methods
 */

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

var checkOverlap = function(x1, y1, w1, h1, x2, y2, w2, h2) {

    return !(x2 > x1 + w1 ||
           x2 + w2 < x1 ||
           y2 > y1 + h1 ||
           y2 + h2 < y1);

};

/**
 * Main classes
 */

var MapTile = function(opts) {

    this.x = opts.x;
    this.y = opts.y;
    this.terrain = opts.terrain;

    this.blocking = opts.blocking || true;

};

var MapGen = function(opts){

    this.size = MAP_SIZE;
    this.terrainTypes = terrainTypes;
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

    console.log('Generating level terrain...');

    // create a series of randomly distributed grid floats
    var points = _createRegionPoints(MAP_SIZE, MAP_SIZE, TERRAIN_NUM_AREAS);

    // now assign a random terrain type to each region spawn point
    for(var i = 0; i < points.length; i++) {
        points[i].terrain = rndInt(0, terrainTypes.length - 1);
    }

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

    console.log('\tComplete');

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

MapGen.prototype._unblockArea = function(x, y, w, h) {
    for(var px = x; px < x + w; px++) {
        for(var py = y; py < y + h; py++) {
            //console.log('unblock cell', c(px,py));
            this.data[c(px,py)].blocking = false;
        }
    }
};

MapGen.prototype.generateAreas = function() {

    console.log('Generating level areas...');
    // Assuming a virtual area the size of our map
    // do some crude BSP shit to divide up the area into regions
    var bspTree = new BSPNode(0, 0, MAP_SIZE - 1, MAP_SIZE - 1, MIN_REGION_SIZE);
    bspTree.splitRandomRecursive(MAX_RECURSIONS);

    console.log('\tBSP tree created');

    // get the distinct regions from the BSP split
    regions = {};
    for(var r = 0; r < MAX_RECURSIONS + 1; r++) {
        regions['level' + r] = [];
    }

    var push_regions = function(parentNode, recursionsLeft) {

        var level = 'level' + (MAX_RECURSIONS - recursionsLeft);
        regions[level].push(parentNode);

        if (! parentNode.childNodes.length) return false;
        if (recursionsLeft == 0) return false;
        recursionsLeft--;

        var level = 'level' + (MAX_RECURSIONS - recursionsLeft);
        regions[level].push(parentNode.childNodes[0]);
        regions[level].push(parentNode.childNodes[1]);

        push_regions(parentNode.childNodes[0], recursionsLeft);
        push_regions(parentNode.childNodes[1], recursionsLeft);
    };

    push_regions(bspTree, MAX_RECURSIONS);

    var set = regions['level4'];  // decent sample, total hack

    // ensure these regions are set to non-blocking
    for(var i = 0; i < set.length; i++) {
        var r = set[i];
        this._unblockArea(r.x + 1, r.y + 1, r.w - 1, r.h - 1);
    }

    this._allRegions = regions;
    this.regions = set;
    console.log('\tRegions created');

};

MapGen.prototype.generateDoorways = function() {

    var regions = this._allRegions;
    this.doors = [];
    for (var l = MAX_RECURSIONS; l > -1; l--) {

        if (!'level' + l in regions || typeof regions['level' + l] == 'undefined') continue;

        var parents = regions['level' + l];

        for (var k = 0; k < parents.length; k++) {
            var kids = parents[k].childNodes;
            if (kids.length == 0) continue;
            if (parents[k].splitType) {

                var cx1 = kids[0].x + Math.floor(kids[0].w / 2),
                    cy1 = kids[0].y + Math.floor(kids[0].y / 2),
                    cx2 = kids[1].x + Math.floor(kids[1].x / 2),
                    cy2 = kids[1].y + Math.floor(kids[1].y / 2);

                if (parents[k].splitType == 'horiz') {

                    var xpos = rndInt(kids[0].x + 1, kids[0].x + kids[0].w - 2);
                    var ypos = kids[1].y;

                } else {
                    var ypos = rndInt(kids[0].y + 1, kids[0].y + kids[0].h - 2);
                    var xpos = kids[1].x;

                }

                var id = c(xpos, ypos);
                this.doors[id] = { x: xpos, y: ypos };
                this.data[id].blocking = false;
                this.data[id].isDoor = true;
            }

        }
    }

};

MapGen.prototype.getAdjacentWallBits = function(x, y) {

    var linked = [
        c(x, y-1),
        c(x-1, y),
        c(x+1, y),
        c(x, y+1),
    ];
    var bits = [1,2,4,8];  // n, w, e, s - todo: should bitwise this or something
    var total = 0;

    for(var i = 0; i < linked.length; i++) {
        if(this.data[linked[i]] === undefined) continue;
        if(this.data[linked[i]].blocking) total += bits[i];
    }
    return total;

};

MapGen.prototype.getAdjacentDifferentBits = function(x, y) {

    var linked = [
        c(x-1, y),
        c(x, y-1),
        c(x+1, y),
        c(x, y+1),
    ];
    var bits = [1,2,4,8];  // w, n, e, s - todo: should bitwise this or something
    var total = 0;

    var terrain = this.data[c(x,y)].terrain;

    for(var i = 0; i < linked.length; i++) {
        if(this.data[linked[i]] === undefined) continue;
        if(this.data[linked[i]].terrain !== terrain) total += bits[i];
    }

    return total;


};

MapGen.prototype.generateWalls = function() {

    console.log('Adding wall segments to map...');

    for(var x = 0; x < MAP_SIZE; x++) {
        for(var y = 0; y < MAP_SIZE; y++) {

            if( this.data[c(x,y)].blocking === false ) continue;

            var bt = this.getAdjacentWallBits(x,y);
            this.data[c(x,y)].wallTile = 20 + bt;

        }
    }

};

MapGen.prototype.generateTileTransitions = function() {

    console.log('Adding tile transitions to map...');

    for(var x = 0; x < MAP_SIZE; x++) {
        for(var y = 0; y < MAP_SIZE; y++) {

            var tile = this.data[c(x,y)];

            if( tile.wallTile ) continue;

            var bt = this.getAdjacentDifferentBits(x,y);

            tile.transTile = 100 + this.terrainTypes[tile.terrain].edgeStartIndex + bt;

        }
    }




};


MapGen.prototype.generate = function() {
    this.generateTerrain();
    this.generateAreas();
    this.generateDoorways();
    this.generateWalls();
    this.generateTileTransitions();
};

MapGen.prototype.exportJSON = function() {

    console.log('Exporting generated JSON map data to tilemap...');

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

    console.log('\tExport complete');

    return exp;

};

MapGen.prototype.exportCSV = function() {

    console.log('Exporting generated CSV map data to tilemap...');

    var exp = '';

    for(var y = 0; y < this.size; y++) {
        var row = [];
        for(var x = 0; x < this.size; x++) {
            var tile = this.data[c(x,y)];
            //if(tile.transTile) console.log('trans tile', x, y, tile.transTile);
            var tid = (tile.blocking) ? tile.wallTile : tile.transTile || terrainTypes[tile.terrain].tile;
            row.push(tid);
        }
        exp += row.join(',') + '\n';
    }
    console.log('\tExport complete');
    return exp;

}


module.exports = MapGen;
