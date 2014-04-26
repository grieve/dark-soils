var _ = require('lodash');
var Phaser = require('phaser');
var Perlin = require('perlin');

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

function rndInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var MapGen = function(opts){

    this.size = 64;

};

MapGen.prototype.init = function() {

    this.data = {};
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

MapGen.prototype.generateRooms = function() {


};

MapGen.prototype.generate = function() {
    this.generateTerrain();
    this.generateRooms();
};

var MapTile = function(opts) {

    this.x = opts.x;
    this.y = opts.y;
    this.terrain = opts.terrain;

    this.blocking = opts.blocking || false;

};


module.exports = MapGen;
