var Tilemap = function(opts){

    this.game = opts.game;
    this.map = this.game.add.tilemap(opts.map, opts.tileWidth, opts.tileHeight);
    this.map.addTilesetImage(opts.tileset);
    this.layer = this.map.createLayer(0);

    this.layer.resizeWorld();


};

Tilemap.prototype.getTerrainAt = function(x, y){
    var tile = this.map.getTile(this.layer.getTileX(x), this.layer.getTileY(y), this.layer);
    switch(tile.index){
        case 100:
            return 'water';
        case 132:
            return 'mud';
        case 164:
            return 'soil';
        case 196:
            return 'grass';
        case 228:
            return 'rock';
        default:
            return 'transition';
    }
};

Tilemap.prototype.destroy = function(){
    this.map.destroy();
};

module.exports = Tilemap;

