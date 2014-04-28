var Phaser = require('phaser');

/**

Create a dynamic set of tiles for use by the tile engine.
Create 32 tiles for each terrain type.

We use a set of tiles from our tilemap as alpha masks.
We use the grass texture as a base
We iterate every terrain type (except grass).

For each terrain type, we iterate every alpha mask.
We create a new image masking the grass texture with the alpha mask.
We apply the masked grass over the terrain texture.
We save the completed image as a new tile.

**/


var TileGen = function(opts) {

    this.game = opts.game;
    this.terrainTypes = opts.terrainTypes;
    this.baseTile = opts.baseTile;
    this.tileImg = opts.tileImg;
    this.maskImg = opts.maskImg;

    var TILE_SIZE = opts.tileSize || 64;
    var GEN_TILE_ROWS = 2, GEN_TILE_COLS = 16;

    this.generatedTileRows = GEN_TILE_ROWS;
    this.generatedTileCols = GEN_TILE_COLS;

    this.init = function() {

        console.log('Initialise tile transition generator...');

        this.baseImg = this.game.make.bitmapData(TILE_SIZE, TILE_SIZE);
        this.baseImg.copyPixels(this.tileImg, { x:this.baseTile * TILE_SIZE, y:0, width: TILE_SIZE, height: TILE_SIZE }, 0, 0);

        this.genCanvas = this.game.make.bitmapData(TILE_SIZE, TILE_SIZE);
        this.maskCanvas = this.game.make.bitmapData(TILE_SIZE, TILE_SIZE);
        this.outputCanvas = this.game.make.bitmapData(TILE_SIZE * 16, TILE_SIZE * 2 * this.terrainTypes.length);

        this.baseDom = new Image();
        this.mainDom = new Image();
        this.maskDom = new Image();
    };

    this.createTiles = function() {

        console.log('Generate tile transitions...');

        var terrainImg = this.game.make.bitmapData(TILE_SIZE, TILE_SIZE);
        var maskImg = this.game.make.bitmapData(TILE_SIZE, TILE_SIZE);



        for(var i = 0; i < this.terrainTypes.length; i++) {

            var t = this.terrainTypes[i];
            t.edgeStartIndex = (i  * GEN_TILE_ROWS) * GEN_TILE_COLS;

            terrainImg.copyPixels(this.tileImg, { x: TILE_SIZE * t.tile, y: 0, width: TILE_SIZE, height: TILE_SIZE }, 0, 0);

            for(var r = 0; r < GEN_TILE_ROWS; r++) {
                for(var c = 0; c < GEN_TILE_COLS; c++) {

                    maskImg.canvas.width = maskImg.canvas.height;
                    maskImg.copyPixels(this.maskImg, { x: c*TILE_SIZE, y: r*TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE}, 0, 0);
                    var comp = this._createComposite(terrainImg, this.baseImg, maskImg);

                    var xpos = c * TILE_SIZE,
                    ypos = ((i * 2) + r) * TILE_SIZE;
                    this.outputCanvas.draw(comp.canvas, xpos, ypos);

                }
            }

        }

        console.log('Transitions generated');

    };

    this._createComposite = function(base, main, mask) {

         // clear temp canvas
        this.genCanvas.canvas.width = this.genCanvas.canvas.height;
        this.maskCanvas.canvas.width = this.maskCanvas.canvas.height;

        this.baseDom.src = base.canvas.toDataURL();
        this.mainDom.src = main.canvas.toDataURL();
        this.maskDom.src = mask.canvas.toDataURL();

        //  And create an alpha mask image by combining pic and mask from the cache
        this.maskCanvas.alphaMask(this.mainDom, this.maskDom);

        this.genCanvas.draw(this.baseDom, 0, 0);
        this.genCanvas.draw(this.maskCanvas.canvas, 0, 0);

        return this.genCanvas;

    };

    this.storeInCache = function() {

        console.log('Storing generated edge tileset in cache');
        this.game.cache.addImage('tilegen-edges', null, this.outputCanvas.canvas);

    };

    this.generate = function() {

        this.init();
        this.createTiles();
        this.storeInCache();

    };

};

module.exports = TileGen;
