var myGame = {};

myGame.Boot = function(game){ };

myGame.Boot.prototype = {
	
	preload: function() {
	this.load.image('dude', 		'images/dude.png');
	this.load.image('background', 	'images/sky.png');
    this.load.image('titleimage', 	'images/TitleImage.png');
        
    },

	create: function() {
        console.log("in boot");
        this.state.start('Preloader');
	}
	
};
