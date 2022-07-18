// https://opengameart.org/content/sci-fi-platformer-tileset
// spritesheet by Michele 'Buch' Bucelli
// https://opengameart.org/users/buch

//-------------------------------------------------------------------------------------------

myGame.MainGameScreen = function(game) {
	this.map;
	this.backgroundLayer;
	this.platformsLayer;
	this.dangerLayer;
	this.levelCompleteLayer;

	this.player;
	this.cursors;

	this.scoreText;
	this.levelText;
	this.score = 0;
	this.currentLevel = 1;

	this.testText;
};

//-------------------------------------------------------------------------------------------

// local variables (initialise these on level load)
var Walking 		= false;
var Jumping 		= false;
var Falling 		= false;
var Landing 		= false;
var Dead 			= false;
var DeadTime		= 0.0;
var JumpTime 		= 0.0;

var Stars			= null;
var VirusEnemies	= null;

// local variables (no need to initialise)
var deathSound;
var pickupSound;
var completeSound;

// constants
var EnemyMoveSpeed	= 50;
var DealthPenalty	= -20;

//-------------------------------------------------------------------------------------------

myGame.MainGameScreen.prototype = {

	//-------------------------------------------------------------------------------------------

	create: function () {
		console.log("in start screen");

		// Initialise text
		var scoreStyle 	= { font: "bold 24pt Arial", fill: "#ffffff", align: "center", stroke: "#404040", strokeThickness: 4 };
		this.scoreText 	= this.add.text(0, 500, "Score: " + this.score.toString(), scoreStyle);
		this.levelText  = this.add.text(0, 550, "Level: " + this.currentLevel.toString(), scoreStyle);
		this.testText = this.add.text(200, 500, "test: ", scoreStyle);
		this.testText.fixedToCamera = true;

		this.scoreText.fixedToCamera = true;
		this.levelText.fixedToCamera = true;

		// Set up map
		this.map = this.add.tilemap('level');
		this.map.addTilesetImage('spacey', 'tileSheet');

		// Initial setup
		Walking 			= false;
		Jumping 			= false;
		Falling 			= true;
		Landing 			= false;
		Dead 				= false;
		DeadTime			= 0.0;
		JumpTime 			= 0.0;
		Stars 				= null;
		VirusEnemies		= null;
		this.score 			= 0;
		this.currentLevel 	= 1;

		// Set up SFX
		deathSound 		= this.add.audio('error');
		pickupSound 	= this.add.audio('pickup');
		completeSound 	= this.add.audio('levelComplete');

		// Set up player animations
		this.player = this.add.sprite(50, 350, 'dude');
		this.player.animations.add('left', [0, 1, 2, 3]);
		this.player.animations.add('right', [5, 6, 7, 8]);
		this.player.animations.add('face', [4]);
		this.player.animations.play('face', 20, true);

		// Set up player physics
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.collideWorldBounds = true;

		// Load level data
		this.updateLevel(this.currentLevel);

		this.xhr = new XMLHttpRequest();
		this.xhr.open("POST", "scores.php", true);
		this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		
		this.xhr.send();

		this.xhr.onload = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				this.scoresObject = JSON.parse(this.responseText);
				this.testText.text = this.scoresObject[0].name + "  " + this.scoresObject[0].score;
			}
		}

	},

	//-------------------------------------------------------------------------------------------

	update: function () {
		//-------------------
		// COLLISIONS
		//-------------------
		this.physics.arcade.collide(this.player, this.platformsLayer);
		this.physics.arcade.collide(VirusEnemies, this.platformsLayer);

		this.physics.arcade.collide(this.player, this.dangerLayer, this.hitDanger, null, this);
		this.physics.arcade.collide(this.player, VirusEnemies, this.hitDanger, null, this);
		this.physics.arcade.collide(this.player, this.levelCompleteLayer, this.hitLevelComplete, null, this);

		this.physics.arcade.overlap(this.player, Stars, this.hitCollectable, null, this);


		//-------------------
		// DEATH
		//-------------------
		if (Dead) {
			this.paused = true;

			DeadTime += this.time.elapsedMS;
			if (DeadTime > 1000) {
				this.state.start('GameOverScreen');
			}

			return;
		}

		//-------------------
		// INPUT
		//-------------------
		if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
			this.player.animations.play('left', 10);
			this.player.body.velocity.x = -160;
			Walking = true;
		}
		else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			this.player.animations.play('right', 10);
			this.player.body.velocity.x = 160;
			Walking = true;
		}
		else {
			this.player.animations.play('face', 20);
			this.player.body.velocity.x = 0;
			Walking = false;
		}

		if (this.input.keyboard.isDown(Phaser.Keyboard.UP) && this.canJump()) {
			this.player.body.velocity.y = -300;
			Jumping = true;

			// console.log("Walking: " + Walking.toString());
			// console.log("Falling: " + Falling.toString());
			// console.log("Jumping: " + Jumping.toString());
			// console.log("Landing: " + Landing.toString());
		}

		//-------------------
		// PLAYER
		//-------------------

		// Move the camera based on player position
		if (this.player.body.position.x > this.camera.x + 300) {
			this.camera.x = this.player.body.position.x - 300;
		}
		else if (this.player.body.position.x < this.camera.x + 200) {
			this.camera.x = this.player.body.position.x - 200;
		}

		// Check if we fell off a ledge
		if (!Jumping && !this.player.body.onFloor()) {
			Falling = true;
		}

		if (Jumping) {
			JumpTime += this.time.elapsedMS;

			this.player.body.gravity.y = JumpTime * 2;

			if (this.player.body.velocity.y > 0 || this.player.body.onFloor()) {
				Jumping = false;
				Falling = true;
				JumpTime = 0.0;
			}
		}

		if (Falling) {
			this.player.body.gravity.y = 800;

			if (this.player.body.onFloor()) {
				Falling = false;
				Landed = true;
			}
		}

		else if (this.landed)
		{
			Landed = false;
		}

		//-------------------
		// ENEMIES
		//-------------------

		// Enemy logic
		VirusEnemies.forEach(function(enemy) {
			if (enemy.body.velocity.x == 0) {
				if (enemy.direction == 'left') {
					enemy.body.velocity.x = EnemyMoveSpeed;
					enemy.direction = 'right';
					enemy.scale.x = 1;
				}
				else {
					enemy.body.velocity.x = -EnemyMoveSpeed;
					enemy.direction = 'left';
					enemy.scale.x = -1;
				}
			}
		}, this);

		// DEBUG
		if (this.input.keyboard.isDown(Phaser.Keyboard.A)) {
			// load level 2
			this.cleanLevel();
			this.currentLevel += 1;
			this.updateLevel(this.currentLevel);
			this.input.keyboard.removeKeyCapture(Phaser.Keyboard.A);
		}
	},

	//-------------------------------------------------------------------------------------------

	canJump: function () {
		return !Jumping && !Falling && !Landing;
	},

	//-------------------------------------------------------------------------------------------

	hitCollectable: function(player, hitObject) {
		hitObject.kill();
		this.updateScore(10);
		pickupSound.play();
		//this.map.removeTile(hitTile.x, hitTile.y, 'Collectables').destroy();
	},

	//-------------------------------------------------------------------------------------------

	hitDanger: function(player, hitTile) {
		if (!Dead) {
			Dead = true;

			deathSound.play();
			this.player.alpha = 0.5;
			this.player.tint = 0xff0000;
			this.player.animations.play('face', 20);
			this.player.body.velocity.x = 0;
		}
	},

	//-------------------------------------------------------------------------------------------

	hitLevelComplete: function(player, hitTile) {
		this.cleanLevel();

		completeSound.play();
		this.currentLevel += 1;
		this.updateLevel(this.currentLevel);
	},

	//-------------------------------------------------------------------------------------------

	updateScore: function(amount) {
		this.score += amount;
		this.scoreText.text = "Score: " + this.score.toString();
	},

	//-------------------------------------------------------------------------------------------

	updateLevel: function(level) {
		var levelString = level.toString();
		this.levelText.text 	= "Level: " + levelString;

		// Set up map
		this.backgroundLayer 	= this.map.createLayer('Background' + levelString);
		this.backgroundLayer.resizeWorld();
		this.platformsLayer 	= this.map.createLayer('Platforms' + levelString);
		this.dangerLayer 		= this.map.createLayer('Danger' + levelString);
		this.levelCompleteLayer = this.map.createLayer('LevelComplete' + levelString);

		this.map.setCollisionByExclusion([0], true, 'Platforms' + levelString);
		this.map.setCollisionByExclusion([0], true, 'Danger' + levelString);
		this.map.setCollisionByExclusion([0], true, 'LevelComplete' + levelString);

		//this.map.setTileIndexCallback(361, this.hitDanger, this, 'Danger' + levelString);

		// Set up objects
		Stars = this.add.group();
		Stars.enableBody = true;

		this.map.createFromObjects('Collectables' + level.toString(), 577, 'star', 0, true, false, Stars);

		// Create enemy objects
		VirusEnemies = this.add.group();
		VirusEnemies.enableBody = true;
		this.map.createFromObjects('VirusEnemies' + level.toString(), 505, 'virus', 10, true, false, VirusEnemies);
		
		VirusEnemies.forEach(function(enemy) {
			enemy.scale.x = -1;
			enemy.animations.add('move', [0, 1, 2, 3]);
			enemy.animations.play('move', 10, true);
			enemy.body.gravity.y = 50;
			enemy.body.velocity.x = -EnemyMoveSpeed;
			enemy.direction = 'left';
			enemy.anchor.setTo(0.5, 0.5);
		}, this);

		this.player.bringToTop();
		this.player.x = 50;
		this.player.y = 350;
		this.player.animations.play('face', 20, true);
	},

	//-------------------------------------------------------------------------------------------

	cleanLevel: function() {
		VirusEnemies.forEach(function(enemy) {
			enemy.destroy();
		}, this);
	}

	//-------------------------------------------------------------------------------------------
};

//-------------------------------------------------------------------------------------------