var Phaser = require('phaser');

var assets = {
    images: [
        ['title-text', 'img/title.png', 533, 124],
        ['pixel', 'img/pix.png', 1, 1],
        ['test-tilemap', 'img/test-tilemap.png', 40, 40],
        ['base-tileset', 'img/base-tilemap.png', 64, 64],
        ['mapgen-tileset', 'img/base-tilemap4.png', 64, 64]
    ],
    spritesheets: [
        ['player', 'img/protagonist_walk.png', 144, 180],
        ['player_dead', 'img/protagonist_dead.png', 151, 151],
        ['enemy', 'img/villain_walk.png', 144, 180],
        ['zombie', 'img/zombie_anim.png', 144, 180],
        ['lost-soul', 'img/lost-soul.png', 120, 160],
        ['grave', 'img/grave.png', 195, 319],
        ['heart', 'img/heart.png', 78, 99],
        ['bones', 'img/bones.png', 90, 85],
        ['finger', 'img/finger.png', 78, 89],
        ['timer', 'img/timer.png', 32, 32],
        ['hole', 'img/hole.png', 160, 80],
        ['glow', 'img/glow_pulse.png', 64, 64],
        ['particle-map', 'img/particle-map.png', 3, 3]
    ],
    tilemaps: [
        ['test-map', 'assets/maps/test.csv', null, Phaser.Tilemap.CSV]
    ],
    fonts: [
        ['narrative-font', 'assets/fonts/narrative.png', 'assets/fonts/narrative.xml']
    ]
};

function preloadAssets(game){
    var idx;

    //load all images
    console.log('Preloading images:');
    for (idx = 0; idx < assets.images.length; idx++){
        console.log("\t" + assets.images[idx][0] + ": " +assets.images[idx][1]);
        game.load.image(
            assets.images[idx][0],
            assets.images[idx][1],
            assets.images[idx][2],
            assets.images[idx][3]
        );
    }

    //load all spritesheets
    console.log('Preloading spritesheets:');
    for (idx = 0; idx < assets.spritesheets.length; idx++){
        console.log("\t" + assets.spritesheets[idx][0] + ": " +assets.spritesheets[idx][1]);
        game.load.spritesheet(
            assets.spritesheets[idx][0],
            assets.spritesheets[idx][1],
            assets.spritesheets[idx][2],
            assets.spritesheets[idx][3]
        );
    }

    //load all tilemaps
    console.log('Preloading tilemaps:');
    for (idx = 0; idx < assets.tilemaps.length; idx++){
        console.log("\t" + assets.tilemaps[idx][0] + ": " +assets.tilemaps[idx][1]);
        game.load.tilemap(
            assets.tilemaps[idx][0],
            assets.tilemaps[idx][1],
            assets.tilemaps[idx][2],
            assets.tilemaps[idx][3]
        );
    }

    //load all fonts
    console.log('Preloading bitmap fonts:');
    for (idx =0; idx < assets.fonts.length; idx++){
        console.log("\t" + assets.fonts[idx][0] + ": " +assets.fonts[idx][1]);
        game.load.bitmapFont(
            assets.fonts[0],
            assets.fonts[1],
            assets.fonts[2]
        );
    }

    //add the rest of the preloaders
};

module.exports = {
    assets: assets,
    preload: preloadAssets
};
