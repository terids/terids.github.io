myGame.StartScreen = function(game) {
	this.startBG;
	this.titleText;
	this.enterText;
};

myGame.StartScreen.prototype = {
	create: function () {
		console.log("in start screen");

		var titleStyle 	= { font: "bold 32pt Arial", fill: "#ffffff", align: "center", stroke: "#404040", strokeThickness: 4 };
		this.titleText 	= this.add.text(this.world.centerX, this.world.centerY, "MY PLATFORMER", titleStyle);
		this.titleText.anchor.setTo(0.5, 0.5);

		var enterStyle 	= { font: "bold 24pt Arial", fill: "#ffffff", align: "center", stroke: "#404040", strokeThickness: 4 };
		this.enterText = this.add.text(this.world.centerX, this.world.centerY + 200, "(Enter) to start...", enterStyle);
		this.enterText.anchor.setTo(0.5, 0.5);
	},

	update: function () {
		this.state.start('MainGameScreen');
		 return;

		if (this.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			this.state.start('MainGameScreen');
		}
	}
};