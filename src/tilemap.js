var Tilemap = function(opts){

    this.game = opts.game;
    this.map = this.game.add.tilemap(opts.map, opts.tileWidth, opts.tileHeight);
    this.map.addTilesetImage(opts.tileset);
    this.layer = this.map.createLayer(0);
    this.layer.resizeWorld();

};

Tilemap.prototype.destroy = function(){
    this.map.destroy();
};

module.exports = Tilemap

