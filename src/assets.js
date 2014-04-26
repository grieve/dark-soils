assets ={
    images: [
        ['test-tilemap', 'img/test-tilemap', 40, 40]
    ],
    spritesheets: []
};

function preloadAssets(game){
    var idx;

    //load all images
    for (idx = 0; idx < assets.images.length; idx++){
        game.load.image(
            assets.images[idx][1],
            assets.images[idx][2],
            assets.images[idx][3], 
            assets.images[idx][4]
        );
    }

    //load all spritesheets
    for (idx = 0; idx < assets.spritesheets.length; idx++){
        game.load.spritesheet(
            assets.images[idx][1],
            assets.images[idx][2],
            assets.images[idx][3], 
            assets.images[idx][4]
        );
    }

    //add the rest of the preloaders
};

module.exports = {
    assets: assets,
    preload: preloadAssets
};
