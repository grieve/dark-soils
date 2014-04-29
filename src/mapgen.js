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

var terrainTypes;

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

    opts = (opts == undefined) ? {} : opts;
    this.size = opts.size || MAP_SIZE;

    this.init();

};

MapGen.prototype.init = function() {

    this.data = {};
    this.regions = [];
    this._allRegions = [];

    terrainTypes = [
        { name: 'water', tile: 5, indexes: [] },
        { name: 'mud', tile: 4, indexes: [] },
        { name: 'soil',  tile: 3, indexes: [] },
        { name: 'grass', tile: 1, indexes: [] },
        { name: 'rock', tile: 2, indexes: [] }
    ];
    this.terrainTypes = terrainTypes;

};

MapGen.prototype.getRegions = function() {

    var rs = [];
    for(var i = 0; i < this.regions.length; i++) {
        var r = this.regions[i];
        rs.push({
            x: r.x,
            y: r.y,
            width: r.w,
            height: r.h
        });
    }
    return rs;
};

MapGen.prototype.getTerrainIndexes = function(terrainName) {
    console.log('terrainIndexes', terrainName, this.terrainTypes);
    var tobj;
    for(var i = 0; i < this.terrainTypes.length; i++) {
        if(this.terrainTypes[i].name == terrainName) {
            tobj = this.terrainTypes[i];
            break;
        }
    }
    return tobj.indexes;

};

MapGen.prototype.getTile = function(x, y) {
    return this.data[c(x,y)];
};

/**
 * Create a series of terrain regions using super-hacky sub-Voronori logic.
 * Procedural generation is hard when you're still hung over.
 */
MapGen.prototype.generateTerrain = function() {

    console.log('Generating level terrain...');

    // create a series of randomly distributed grid floats
    var points = _createRegionPoints(this.size, this.size, TERRAIN_NUM_AREAS);

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
    var bspTree = new BSPNode(0, 0, this.size - 1, this.size - 1, MIN_REGION_SIZE);
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
        //regions[level].push(parentNode.childNodes[0]);
        //regions[level].push(parentNode.childNodes[1]);

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

                    var xpos = rndInt(kids[0].x + 1, kids[0].x + kids[0].w - 3);
                    var ypos = Math.max(1, kids[1].y - 1);

                } else {
                    var ypos = rndInt(kids[0].y + 1, kids[0].y + kids[0].h - 3);
                    var xpos = Math.max(1, kids[1].x - 2);

                }

               this._unblockArea(xpos, ypos, 3, 3);
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

    for(var x = 0; x < this.size; x++) {
        for(var y = 0; y < this.size; y++) {

            var tile = this.data[c(x,y)];

            if( ! (tile.blocking) ) {
                this.terrainTypes[tile.terrain].indexes.push({ x: x, y: y});
                continue;
            }

            var bt = this.getAdjacentWallBits(x,y);
            tile.wallTile = 20 + bt;

        }
    }

};

MapGen.prototype.generateTileTransitions = function() {

    console.log('Adding tile transitions to map...');

    for(var x = 0; x < this.size; x++) {
        for(var y = 0; y < this.size; y++) {

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
