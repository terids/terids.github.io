myGame.Preloader = function(game) {
	this.preloadBar = null;
	this.titleText = null;
	this.ready = false;

	//this.xhr = new XMLHttpRequest();
};

myGame.Preloader.prototype = {
	
	preload: function () {
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		this.titleText = this.add.image(this.world.centerX, this.world.centerY-220, 'titleimage');
		this.titleText.anchor.setTo(0.5, 0.5);
        
        //preload main game assets here
		this.load.image(		'sky', 		'images/sky.png');
		this.load.image(		'ground', 	'images/platform.png');
		this.load.image(		'star', 	'images/star.png');
		this.load.image(		'bomb', 	'images/bomb.png');
		this.load.spritesheet(	'dude', 	'images/dude.png', 32, 48, 9 );

		this.load.tilemap(	'level', 'tilemaps/level.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image(	'tileSheet',	'images/sheet.png');
		this.load.image(	'starSheet', 	'images/star2.png');

		this.load.spritesheet( 'virus', 'images/virus.png', 24, 24);

		this.load.audio( 'error', 'audio/Error.mp3');
		this.load.audio( 'pickup', 'audio/Pickup.mp3');
		this.load.audio( 'levelComplete', 'audio/LevelComplete.mp3');
	},

	create: function () {
        console.log("in preloader");
		this.preloadBar.cropEnabled = false; //force show the whole thing
	},

	update: function () {
	   	this.ready = true;
        this.state.start('StartScreen'); //when create function is complete go to the start screen
	}
};
