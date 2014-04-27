var Game = require('./game');
window.WebFontConfig = {
    google: {
        families: [
            'Shadows+Into+Light::latin',
            'Gloria+Hallelujah::latin',
            'Calligraffitti::latin',
            'Chewy::latin',
            'Rock+Salt::latin'
        ]
    },
    active: function(){
        new Game();
    }
};

var wf = document.createElement('script');
wf.src = '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
wf.type = 'text/javascript';
wf.async = 'true';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(wf, s);
