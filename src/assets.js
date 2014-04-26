var Phaser = require('phaser');

assets ={
    images: [
        ['test-tilemap', 'img/test-tilemap.png', 40, 40]
    ],
    spritesheets: [
        ['player', 'img/player.png', 96, 161]
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
