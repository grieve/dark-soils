var Phaser = require('phaser');

var assets = {
    images: [

        ['title', 'img/title.png', 650, 250],
        ['test-tilemap', 'img/test-tilemap.png', 40, 40],
        ['base-tileset', 'img/base-tilemap.png', 64, 64],
        ['mapgen-tileset', 'img/base-tilemap2.png', 64, 64]
    ],
    spritesheets: [
        ['player', 'img/protagonist_walk.png', 144, 180],
        ['enemy', 'img/villain_walk.png', 144, 180],
        ['zombie', 'img/zombie.png', 96, 163],
        ['grave', 'img/grave.png', 195, 319],
        ['timer', 'img/timer.png', 32, 32],
        ['particle-map', 'img/particle-map.png', 3, 3]
    ],
    tilemaps: [
        ['test-map', 'assets/maps/test.csv', null, Phaser.Tilemap.CSV]
    ]
};

function preloadAssets(game){
    var idx;

    //load all images
    for (idx = 0; idx < assets.images.length; idx++){
        game.load.image(
            assets.images[idx][0],
            assets.images[idx][1],
            assets.images[idx][2],
            assets.images[idx][3]
        );
    }

    //load all spritesheets
    for (idx = 0; idx < assets.spritesheets.length; idx++){
        game.load.spritesheet(
            assets.spritesheets[idx][0],
            assets.spritesheets[idx][1],
            assets.spritesheets[idx][2],
            assets.spritesheets[idx][3]
        );
    }

    //load all tilemaps
    for (idx = 0; idx < assets.tilemaps.length; idx++){
        game.load.tilemap(
            assets.tilemaps[idx][0],
            assets.tilemaps[idx][1],
            assets.tilemaps[idx][2],
            assets.tilemaps[idx][3]
        );
    }

    //add the rest of the preloaders
};

module.exports = {
    assets: assets,
    preload: preloadAssets
};
