myGame.GameOverScreen = function(game) {
	this.gameOverText;
	this.enterOverText;
};

myGame.GameOverScreen.prototype = {
	create: function () {
		console.log("in game over screen");

		this.world.bounds.setTo(0, 0, 800, 600);

		this.camera.x = 0;
		this.camera.y = 0;

		var titleStyle 	= { font: "bold 32pt Arial", fill: "#ff444444", align: "center", stroke: "#ff4040", strokeThickness: 4 };
		this.gameOverText 	= this.add.text(this.world.centerX, this.world.centerY, "YOU DEAD", titleStyle);
		this.gameOverText.anchor.setTo(0.5, 0.5);

		var enterStyle 	= { font: "bold 24pt Arial", fill: "#ff44444", align: "center", stroke: "#ff4040", strokeThickness: 4 };
		this.enterOverText = this.add.text(this.world.centerX, this.world.centerY + 200, "(Enter) to return to main...", enterStyle);
		this.enterOverText.anchor.setTo(0.5, 0.5);
	},

	update: function () {
		//this.state.start('MainGameScreen');
		// return;

		if (this.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			this.state.start('StartScreen');
		}
	}
};