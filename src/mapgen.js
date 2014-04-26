var _ = require('lodash');
var Phaser = require('phaser');
var Perlin = require('perlin');
var ROT = require('rot');

var MAP_SIZE = 64,

MIN_ROOMS = 6,
MAX_ROOMS = 12,
ROOM_SIZE_MIN = 6,
ROOM_SIZE_MAX = 36,

TILE_SIZE = 64;

var terrainTypes = [
    { name: 'water', min: -1, max: -0.9},
    { name: 'mud', min: -0.98, max: -0.7},
    { name: 'soil', min: -0.69, max: -0.5},
    { name: 'ground', min: -0.4, max:0.6},
    { name: 'rock', min: 0.61, max:0.9},
    { name: 'grave', min: 0.91, max: 1}
];


var c = function(x, y) {
    return 'x' + x + 'y' + y;
};

var rndInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var MapTile = function(opts) {

    this.x = opts.x;
    this.y = opts.y;
    this.terrain = opts.terrain;

    this.blocking = opts.blocking || true;

};

var MapRoom = function(opts) {

    this.x = opts.x;
    this.y = opts.y;
    this.width = opts.width;
    this.height = opts.height;
    this.map = opts.map;

    this.tiles = {};
    for(var x = 0; x < this.width; x++) {
        for(var y = 0; y < this.height; y++) {
            var rc = c(x, y),
            mc = c(this.x + x, this.y + y);
            this.map.data[mc].blocking = false;
            this.tiles[rc] = this.map.data[mc];
        }
    }

};

var MapGen = function(opts){

    this.size = MAP_SIZE;
    this.init();

};

MapGen.prototype.init = function() {

    this.data = {};
    this.rooms = {};
    noise.seed(Math.random());  // global from perlin

};

MapGen.prototype.addRandomTile = function(x, y) {

    var value = noise.simplex2(x, y);
    var rndTerrain = 3; // default to ground
    for(var i = 0; i < terrainTypes.length; i++) {
        var t = terrainTypes[i];
        if(value >= t.min && value <= t.max) {
            rndTerrain = i;
            break;
        }
    }
    //var rndTerrain = Math.round(Math.abs(value) * terrainTypes.length);
    this.data[c(x, y)] = new MapTile({ x: x, y: y, terrain: rndTerrain });

};

MapGen.prototype.getAdjacentTerrainCount = function(x, y) {

    var linked = [
        c(x-1, y-1), c(x, y-1), c(x+1, y-1),
        c(x-1, y), c(x+1, y),
        c(x-1, y+1), c(x, y+1), c(x+1, y+1)
    ];
    var total = 0;
    var terrain = this.data[c(x,y)].terrain;
    for(var i = 0; i < 8; i++) {
        if(this.data[linked[i]] === undefined) continue;
        if(this.data[linked[i]].terrain == terrain) total++;
    }
    return total;
};

MapGen.prototype.generateTerrain = function() {

    for(var x = 0; x < this.size; x++) {
        for(var y = 0; y < this.size; y++) {
            this.addRandomTile(x, y);
        }
    }

    // run passes on the random map
    for(var k in this.data) {
        var tile = this.data[k];
        var adjs = this.getAdjacentTerrainCount(tile.x, tile.y);

        var terrain = tile.terrain;

        switch(terrain) {
            case 0:  // water
                if(adjs == 0) tile.terrain = 3;
                break;

            default: //
                break;
        }
    }

};

var checkOverlap = function(x1, y1, w1, h1, x2, y2, w2, h2) {

    return !(x2 > x1 + w1 ||
           x2 + w2 < x1 ||
           y2 > y1 + h1 ||
           y2 + h2 < y1);

};

MapGen.prototype.generateRooms = function() {

    var roomcount = rndInt(MIN_ROOMS, MAX_ROOMS);
    var retries = 10;

    while(roomcount && retries) {

        var w = rndInt(ROOM_SIZE_MIN, ROOM_SIZE_MAX),
        h = rndInt(ROOM_SIZE_MIN, ROOM_SIZE_MAX),
        x = rndInt(0, this.size - w),
        y = rndInt(0, this.size - h);

        var ok = true;
        for(var k in this.rooms) {
            var r = this.rooms[k];
            if(checkOverlap(x,y,w,h,r.x,r.y,r.width,r.height)) {
                ok = false;
                break;
            }
        }
        if(ok) {
            this.rooms['room' + roomcount] = new MapRoom({
                x: x, y: y, width: w, height: h, map: this
            });
            roomcount--;
        } else {
            retries--;
        }

    }

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
    //this.generateRooms();
    this.generateROTMap();
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

    /*var ts = {
        firstgid: 0,
        image: "img/test-tilemap.png",
        imageheight: 400,
        imagewidth: 400,
        margin: 0,
        name: "test-tilemap",
        properties: {},
        spacing: 0,
        tileheight: 40,
        tileproperties: {},
        tilewidth: 40
    };
    exp.tilesets.push(ts);*/


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
            var tid = (tile.blocking) ? 0 : tile.terrain + 1;
            row.push(tid);
        }
        exp += row.join(',') + '\n';
    }
    console.log('exported', exp);
    return exp;

}


module.exports = MapGen;
