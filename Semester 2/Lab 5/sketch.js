
const charStarParam = {
	charStartPoint: {
		x: 25,
		y: 432
	},
	movement: {
		walkSpeed: 200,
		jumpSpeed: 450,
		jumpHeight: 100,
		gravityAcc: 4000
	}
}; // starting paramaters of the main character

const canvasSize = {
	x: 1024,
	y: 576
};

const worldSize = 2048;

const groundBorder = 432;
const fps = 60;

const gameObjects = {
	sceneryObjects: [
		new Ground(),

		new Cloud(200, 150, 1),

		new Mountain(1900, 1),

		new Tree(100, 1),

		new Flag(25, "Green")
	],

	canyons: [
	],

	platforms: [
	],

	coins: [
	],

	enemySpawnPoints: [
	],

	enemies: [
	],

	mainCharacter: new Character()
}

const sounds = { music: undefined, death: undefined, fall: undefined, kill: undefined, coin: undefined };

const scoreCounter = {
	score: 0,
	highScore: 0,
	scoreForEnemy: 5,
	scoreForCoin: 1,

	draw: function () {
		textSize(25);
		fill(255);
		stroke(0);
		text(`Score: ${this.score}`, 0, 25);
		text(`High score: ${this.highScore}`, 0, 50);
	}, // draws current and highest score

	checkScore: function () {
		if (this.highScore < this.score) {
			this.highScore = this.score;
		}
	} // rewrites highscore
};

const sliders = { music: undefined, sfx: undefined };

const buttons = { reset: undefined, musicOff: undefined };

const images = { music: undefined, sound: undefined, musicOff: undefined, soundOff: undefined};

const camera = new Camera();

function preload() {
	soundFormats('mp3', 'wav');
	sounds.music = loadSound("assets/HoliznaCC0 - Game BOI 2.mp3");
	sounds.death = loadSound("assets/DeathByEnemy.wav");
	sounds.fall = loadSound("assets/FallIntoCanyon.wav");
	sounds.kill = loadSound("assets/EnemyDeath.wav");
	sounds.coin = loadSound("assets/Coin.wav");
}

function setup() {
	createCanvas(canvasSize.x, canvasSize.y);
	frameRate(fps);

	sounds.music.loop();

	sliders.music = createSlider(0, 100, 50);
	sliders.music.position(0, canvasSize.y);
	sliders.music.size(100);
	sliders.music.style("writing-mode", "sideways-lr");
	sliders.sfx = createSlider(0, 100, 50);
	sliders.sfx.position(100, canvasSize.y);
	sliders.sfx.size(100);
	sliders.sfx.style("writing-mode", "sideways-lr");

	buttons.reset = createButton('Reset');
	buttons.reset.position(canvasSize.x / 2, canvasSize.y / 2);
	buttons.reset.style("border", "2px solid");
	buttons.reset.style("border-radius", "10px");
	buttons.reset.hide();
	buttons.musicOff = createButton('Pause')
	buttons.musicOff.mousePressed(pauseMusic);
	buttons.musicOff.position(25, canvasSize.y + 165);
	buttons.musicOff.style("border", "2px solid");
	buttons.musicOff.style("border-radius", "10px");
	
	images.music = createImg("assets/music.svg");
	images.music.size(25, 25);
	images.music.position(37, canvasSize.y+135);
	images.musicOff = createImg("assets/off.svg");
	images.musicOff.size(25, 25);
	images.musicOff.position(37, canvasSize.y + 135);
	images.musicOff.hide();
	images.sound = createImg("assets/sfx.svg");
	images.sound.size(25, 25);
	images.sound.position(140, canvasSize.y + 135);
	images.soundOff = createImg("assets/off.svg");
	images.soundOff.size(25, 25);
	images.soundOff.position(140, canvasSize.y + 135);
	images.soundOff.hide();

	mapGenerator(10);
}

function draw() {

	background(100, 155, 255); //fill the sky blue

	soundVolume(sliders.music.value() / 100, sliders.sfx.value() / 100); // set volume for sounds

	let isDead = gameObjects.mainCharacter.IsDead;
	if (!isDead) {
		(char => (char.move(), camera.move(char), char.death()))(gameObjects.mainCharacter); // moves character and camera, checks if he is not dead
	}

	gameObjects.sceneryObjects.forEach(object => object.draw(camera.x)); // draws all background objects

	gameObjects.canyons.forEach(canyon => canyon.draw(camera.x)); // draws all canyons

	gameObjects.platforms.forEach(platfrom => platfrom.draw(camera.x)); //draws all platforms

	gameObjects.coins.forEach((coin, ind) => (coin.move(), coin.collect(ind), coin.draw(camera.x))); // moves, draws and collects all coins

	gameObjects.enemySpawnPoints.forEach(point => point.draw(camera.x));

	gameObjects.enemies.forEach((enemy, ind) => (enemy.move(), enemy.death(ind), enemy.draw(camera.x))); // moves, draws and kills all enemies
	
	if(!isDead) {
		gameObjects.mainCharacter.draw(camera.x); //draws character
	}

	(counter => (counter.checkScore(), counter.draw()))(scoreCounter); //draws score counter

	objectGenerator(3, 3); // generate random object every 3 seconds, max 3 enemies
}

function Canyon(posX, width) { //posX is coords for top left corner. width is width of a canyon
	this.x = posX;
	this.y = groundBorder;
	this.width = width;
	this.height = canvasSize.y - groundBorder;

	this.draw = function (cameraPos) {
		let drawX = this.x - cameraPos + canvasSize.x / 2;

		fill(100);
		rect(drawX, this.y, this.width, this.height);
	}

	return this;
}

function Cloud(posX, posY, size) { //posX and posY are coords for the center of bigger(middle) ellipse. Default size is 1
	this.x = posX;
	this.y = posY;
	this.k = size;

	this.draw = function (cameraPos) {
		let drawX = this.x - cameraPos + canvasSize.x / 2;

		fill(255);
		ellipse(drawX, this.y, 100 * this.k, 50 * this.k);
		ellipse(drawX - (50 * this.k), this.y, 60 * this.k, 35 * this.k);
		ellipse(drawX + (50 * this.k), this.y, 60 * this.k, 35 * this.k);
	}

	return this;
}

function Mountain(posX, size) { //posX is coords for bottom left corner. Default size is 1
	this.x = posX;
	this.y = groundBorder;
	this.k = size;

	this.draw = function (cameraPos) {
		let drawX = this.x - cameraPos + canvasSize.x / 2;

		fill(100);
		triangle(drawX + (50 * this.k), this.y - (132 * this.k), drawX, this.y, drawX + (100 * this.k), this.y);
		fill(255);
		triangle(drawX + (50 * this.k), this.y - (132 * this.k), drawX + (40 * this.k), this.y - (106 * this.k), drawX + (60 * this.k), this.y - (106 * this.k));
	}

	return this;
}

function Tree(posX, size) { //posX is coords for bottom left corner of a tree trunk. Default size is 1
	this.x = posX;
	this.y = groundBorder;
	this.k = size;

	this.draw = function (cameraPos) {
		let drawX = this.x - cameraPos + canvasSize.x / 2;
		fill("brown");
		rect(drawX, this.y - (27 * this.k), 15 * this.k, 27 * this.k);
		fill(0, 155, 0);
		triangle(drawX - (25 * this.k), this.y - (27 * this.k), drawX + (40 * this.k), this.y - (27 * this.k), drawX + (7 * this.k), this.y - (72 * this.k));
		triangle(drawX - (25 * this.k), this.y - (47 * this.k), drawX + (40 * this.k), this.y - (47 * this.k), drawX + (7 * this.k), this.y - (97 * this.k));
		triangle(drawX - (25 * this.k), this.y - (67 * this.k), drawX + (40 * this.k), this.y - (67 * this.k), drawX + (7 * this.k), this.y - (117 * this.k));
	}

	return this;
}

function Ground() { //ground visual
	this.x = 0;
	this.y = groundBorder;
	this.width = worldSize;
	this.height = canvasSize.y - groundBorder;

	this.draw = function () {
		noStroke();
		fill(0, 155, 0);
		rect(this.x, this.y, this.width, this.height);
	}

	return this;
}

function Platform(posX, posY, width, height, color) {//posX and posY are coords for top left corner. width and height are width and height of a platform
	this.x = posX;
	this.y = posY;
	this.width = width;
	this.height = height;
	this.color = color;

	this.draw = function(cameraPos) {
		let drawX = this.x - cameraPos + canvasSize.x / 2;

		fill(this.color);
		stroke(0);
		rect(drawX, this.y, this.width, this.height);
	}
}

function Flag(posX, color) { //posX is coords for center of pole, color is the colour of the flag
	this.x = posX;
	this.color = color;

	this.draw = function (cameraPos) {
		let drawX = this.x - cameraPos + canvasSize.x / 2;
		
		fill("Brown");
		noStroke();
		rect(drawX - 3, groundBorder - 50, 7, 50);
		fill(this.color);
		triangle(drawX + 4, groundBorder - 50, drawX + 4, groundBorder - 26, drawX + 25, groundBorder - 38);
	}
}

function Coin(posX, posY, speed, size) { //posX and posY are coords for the center of a coin, speed is the speed of the coin. Default size is 1
	this.x = posX;
	this.y = posY;
	this.speed = speed;
	this.direction = Math.random() * 2 * Math.PI;
	this.k = size;
	this.radius = 20 * this.k;

	this.draw = function (cameraPos) {
		let drawX = this.x - cameraPos + canvasSize.x / 2;

		fill(240, 200, 0);
		noStroke();
		circle(drawX, this.y, 2 * this.radius);
		fill(255);
		textSize(25 * this.k);
		text("C", drawX - (10 * this.k), this.y + (10 * this.k));
	}

	this.move = function () {
		if (this.x >= (worldSize - this.radius) || this.x <= this.radius) {
			if (this.direction <= Math.PI) {
				this.direction = Math.PI - this.direction;
			} else {
				this.direction = 3 * Math.PI - this.direction;
			}

			if (this.x <= this.radius) {
				this.x = this.radius;
			} else {
				this.x = worldSize - this.radius;
			}
		} // if it hits vertical border, change horizontal direction

		if (this.y >= (groundBorder - this.radius) || this.y <= this.radius) {
			this.direction = 2 * Math.PI - this.direction;

			if (this.y <= this.radius) {
				this.y = this.radius;
			} else {
				this.y = groundBorder - this.radius;
			}
		} // if it hits horizontal border, change vertical direction

		let axisSpeed = {
			x: this.speed * cos(this.direction) / frameRate(),
			y: this.speed * sin(this.direction) / frameRate()
		} // individual speed for each axis

		this.x += axisSpeed.x;
		this.y += axisSpeed.y; // moves coin
	}

	this.collect = function (ind) {
		let collectionZone = {
			x: gameObjects.mainCharacter.x - 11,
			y: gameObjects.mainCharacter.y,
			width: 22,
			height: 70
		};

		distX = collectionZone.x - this.x;
		distY = collectionZone.y - this.y

		if ((-(collectionZone.width + this.radius) <= distX && distX <= this.radius) && (-this.radius) <= distY && distY <= (collectionZone.height + this.radius)) {
			scoreCounter.score += scoreCounter.scoreForCoin;
			sounds.coin.play();
			gameObjects.coins.splice(ind, 1);
		}
	} //collects coin

	return this;
}

function Character() { // coords of this objects are located in the middle of bottom border(end of legs). Height is 70 pixels and width is 22
	this.x = charStarParam.charStartPoint.x;
	this.y = charStarParam.charStartPoint.y;
	this.canvasX = this.x;
	this.IsDead = false;

	this.movement = {
		walkSpeed: charStarParam.movement.walkSpeed,
		walkDirection: 0,
		jumpSpeed: charStarParam.movement.jumpSpeed,
		jumpHeight: charStarParam.movement.jumpHeight,
		groundBorder: groundBorder,
		velocityY: 0,
		gravityAcc: charStarParam.movement.gravityAcc,
		ableToJump: charStarParam.charStartPoint.y === this.groundBorder,
		isInAir: !this.ableToJump,
		jumpGround: this.groundBorder,
		inCanyon: false
	};

	this.drawStates = {
		drawFront: function (posX) {
			fill("red");
			stroke(0);
			rect(posX - 10, this.y - 60, 20, 40); //body

			strokeWeight(2);
			line(posX - 5, this.y - 20, posX - 5, this.y); //left leg

			line(posX + 5, this.y - 20, posX + 5, this.y); //right leg

			line(posX - 12, this.y - 55, posX - 12, this.y - 35); //left arm

			line(posX + 12, this.y - 55, posX + 12, this.y - 35); //right arm

			strokeWeight(1);
			fill("pink");
			rect(posX - 5, this.y - 70, 10, 10) //face

			strokeWeight(2);
			point(posX - 2, this.y - 67)
			point(posX + 3, this.y - 67) //eyes
		},

		drawRight: function (posX) {
			fill("red");
			stroke(0);
			rect(posX - 10, this.y - 60, 20, 40); //body

			strokeWeight(2);
			line(posX - 5, this.y - 20, posX - 5, this.y); //left leg

			line(posX + 5, this.y - 20, posX + 5, this.y); //right leg

			line(posX - 12, this.y - 55, posX - 12, this.y - 45);
			line(posX - 12, this.y - 45, posX - 1, this.y - 45); //left arm

			line(posX + 12, this.y - 55, posX + 12, this.y - 45);
			line(posX + 12, this.y - 45, posX + 22, this.y - 45); //right arm

			strokeWeight(1);
			fill("pink");
			rect(posX - 5, this.y - 70, 10, 10) //face

			strokeWeight(2);
			point(posX + 3, this.y - 67) //eye
		},

		drawLeft: function (posX) {
			fill("red");
			stroke(0);
			rect(posX - 10, this.y - 60, 20, 40); //body

			strokeWeight(2);
			line(posX - 5, this.y - 20, posX - 5, this.y); //left leg

			line(posX + 5, this.y - 20, posX + 5, this.y); //right leg

			line(posX - 12, this.y - 55, posX - 12, this.y - 45);
			line(posX - 12, this.y - 45, posX - 21, this.y - 45); //left arm

			line(posX + 12, this.y - 55, posX + 12, this.y - 45);
			line(posX + 12, this.y - 45, posX + 2, this.y - 45); //right arm

			strokeWeight(1);
			fill("pink");
			rect(posX - 5, this.y - 70, 10, 10) //face

			strokeWeight(2);
			point(posX - 2, this.y - 67) //eye
		},

		drawJumpFront: function (posX) {
			fill("red");
			stroke(0);
			rect(posX - 10, this.y - 60, 20, 40); //body

			strokeWeight(2);
			line(posX - 5, this.y - 20, posX - 5, this.y); //left leg

			line(posX + 5, this.y - 20, posX + 5, this.y); //right leg

			line(posX - 12, this.y - 55, posX - 12, this.y - 75); //left arm

			line(posX + 12, this.y - 55, posX + 12, this.y - 75); //right arm

			strokeWeight(1);
			fill("pink");
			rect(posX - 5, this.y - 70, 10, 10) //face

			strokeWeight(2);
			point(posX - 2, this.y - 67)
			point(posX + 3, this.y - 67) //eyes
		},

		drawJumpRight: function (posX) {
			fill("red");
			stroke(0);
			rect(posX - 10, this.y - 60, 20, 40); //body

			strokeWeight(2);
			line(posX - 5, this.y - 20, posX - 5, this.y - 10);
			line(posX - 5, this.y - 10, posX - 15, this.y - 10); //left leg

			line(posX + 5, this.y - 20, posX + 5, this.y - 10);
			line(posX + 5, this.y - 10, posX - 5, this.y - 10); //right leg

			line(posX - 12, this.y - 55, posX - 12, this.y - 45);
			line(posX - 12, this.y - 45, posX - 1, this.y - 45); //left arm

			line(posX + 12, this.y - 55, posX + 12, this.y - 45);
			line(posX + 12, this.y - 45, posX + 22, this.y - 45); //right arm

			strokeWeight(1);
			fill("pink");
			rect(posX - 5, this.y - 70, 10, 10) //face

			strokeWeight(2);
			point(posX + 3, this.y - 67) //eye
		},

		drawJumpLeft: function (posX) {
			fill("red");
			stroke(0);
			rect(posX - 10, this.y - 60, 20, 40); //body

			strokeWeight(2);
			line(posX - 5, this.y - 20, posX - 5, this.y - 10);
			line(posX - 5, this.y - 10, posX + 5, this.y - 10); //left leg

			line(posX + 5, this.y - 20, posX + 5, this.y - 10);
			line(posX + 5, this.y - 10, posX + 15, this.y - 10); //right leg

			line(posX - 12, this.y - 55, posX - 12, this.y - 45);
			line(posX - 12, this.y - 45, posX - 21, this.y - 45); //left arm

			line(posX + 12, this.y - 55, posX + 12, this.y - 45);
			line(posX + 12, this.y - 45, posX + 2, this.y - 45); //right arm

			strokeWeight(1);
			fill("pink");
			rect(posX - 5, this.y - 70, 10, 10) //face

			strokeWeight(2);
			point(posX - 2, this.y - 67) //eye
		}
	};

	this.move = function () {
		if (keyIsDown(68) && !this.movement.inCanyon && this.x < worldSize - 11) {
			this.movement.walkDirection = 1;
		} else if (keyIsDown(65) && !this.movement.inCanyon && this.x > 11) {
			this.movement.walkDirection = -1;
		} else {
			this.movement.walkDirection = 0;
		} // checks which direction character should walk

		let foundPlatform = false;
		for(i = 0; i < gameObjects.platforms.length; i++) {
			let platform = gameObjects.platforms[i];
			if( (((this.x - 11) >= platform.x && (this.x - 11) <= (platform.x + platform.width)) ||
				((this.x + 11) >= platform.x && (this.x + 11) <= (platform.x + platform.width))) &&
				this.y <= platform.y) {
				this.movement.groundBorder = platform.y;
				foundPlatform = true;
			}
		} //checks and sets platforms as ground
		if(!foundPlatform && this.movement.groundBorder != groundBorder) {
			this.movement.groundBorder = groundBorder;
		}//check if there is no platform underneath after standing on one

		for (i = 0; i < gameObjects.canyons.length; i++) {
			let canyon = gameObjects.canyons[i];
			if ((this.x - 11) > canyon.x && (this.x + 11) < (canyon.x + canyon.width) && this.y >= groundBorder) { // ±11 is offset for arms
				this.movement.inCanyon = true;
				this.movement.isInAir = true;
			}
		} // checks if player should fall into canyon

		if (keyIsDown(32) && this.movement.ableToJump && !this.movement.inCanyon) { // keycode 32 is for space
			if(!this.movement.isInAir) {
				this.movement.jumpGround = this.movement.groundBorder;
			}
			this.movement.velocityY = -this.movement.jumpSpeed;
			this.movement.isInAir = true;
			if (this.y <= (this.movement.jumpGround - this.movement.jumpHeight)) {
				this.movement.ableToJump = false;
			}
		} else if (this.movement.isInAir || this.movement.inCanyon) {
			this.movement.velocityY += this.movement.gravityAcc / frameRate();
			if((this.y + this.movement.velocityY / frameRate()) >= this.movement.groundBorder && !this.movement.inCanyon) {
				this.movement.velocityY = (this.movement.groundBorder - this.y) * frameRate();
			}//checks if you should reach the ground in this frame

			this.movement.ableToJump = false;
			if (this.y >= this.movement.groundBorder && !this.movement.inCanyon) {
				this.movement.ableToJump = true;
				this.movement.isInAir = false;
				this.movement.velocityY = 0;
				this.y = this.movement.groundBorder;
			}
		} else if (this.y != this.movement.groundBorder) {
			this.movement.isInAir = true;
			this.movement.ableToJump = false;
		}// checks if character should jump or fall

		this.x += this.movement.walkSpeed * this.movement.walkDirection / frameRate();
		this.y += this.movement.velocityY / frameRate();
	};

	this.death = function () {
		if (this.y >= canvasSize.y) {
			sounds.fall.play();
			this.deathScreen();
		}

		for (i = 0; i < gameObjects.enemies.length; i++) {
			let enemy = gameObjects.enemies[i];
			let sides = {
				left: enemy.x - enemy.radius,
				right: enemy.x + enemy.radius,
				bottom: enemy.y + enemy.radius,
				death: enemy.y + enemy.radius / 2
			}

			if ((sides.left <= this.x && this.x <= sides.right) && (sides.death < this.y && this.y <= sides.bottom)) {
				sounds.death.play();
				this.deathScreen();
			}
		}
	}

	this.draw = function (cameraPos) {
		let drawX = this.x - cameraPos + canvasSize.x / 2;
		if (this.movement.isInAir) {
			switch (this.movement.walkDirection) {
				case 0:
					this.drawStates.drawJumpFront.bind(this)(drawX);
					break;
				case 1:
					this.drawStates.drawJumpRight.bind(this)(drawX);
					break;
				case -1:
					this.drawStates.drawJumpLeft.bind(this)(drawX);
					break;
			}
		} else {
			switch (this.movement.walkDirection) {
				case 0:
					this.drawStates.drawFront.bind(this)(drawX);
					break;
				case 1:
					this.drawStates.drawRight.bind(this)(drawX);
					break;
				case -1:
					this.drawStates.drawLeft.bind(this)(drawX);
					break;
			}
		}
	};

	this.deathScreen = function () {
		buttons.reset.show();
		buttons.reset.mousePressed(gameObjects.mainCharacter.reset.bind(this))
		this.IsDead = true;
	}

	this.reset = function () {
		buttons.reset.hide();
		gameObjects.enemies = [];
		gameObjects.coins = [];
		this.IsDead = false;
		this.x = charStarParam.charStartPoint.x;
		this.y = charStarParam.charStartPoint.y;
		this.movement.inCanyon = false;
		this.movement.ableToJump = charStarParam.charStartPoint.y === this.groundBorder;
		this.movement.isInAir = !this.movement.ableToJump;
		this.movement.velocityY = 0;
		scoreCounter.score = 0;
	}

	return this;
}

function Enemy(posX, speed, size) { //posX is coords for the center of an enemy. directionX is the direction of movement where 1 is right and -1 is left. Default size is 1
	this.k = size;
	this.radius = 20 * this.k;
	this.x = posX;
	this.y = groundBorder - this.radius;
	this.speed = speed;
	this.directionX = Math.round(Math.random()) * 2 - 1;;
	this.inCanyon = false;

	this.draw = function (cameraPos) {
		let drawX = this.x - cameraPos + canvasSize.x / 2;

		fill(225, 0, 0);
		noStroke();
		circle(drawX, this.y, 2 * this.radius);
	}

	this.move = function () {
		this.x += this.speed * this.directionX / frameRate();

		for (i = 0; i < gameObjects.canyons.length; i++) {
			let canyon = gameObjects.canyons[i];
			let leftSide = canyon.x;
			let rightSide = canyon.x + canyon.width;

			if (this.x > (leftSide - this.radius) && this.x < (rightSide + this.radius)) {
				this.directionX *= -1;
				this.x = (this.directionX === -1) ? (leftSide - this.radius) : (rightSide + this.radius);
			} // checks if enemy reaches a canyon
		}

		if (this.x < this.radius || this.x > (worldSize - this.radius)) {
			this.directionX *= -1;
			this.x = (this.directionX === -1) ? (worldSize - this.radius) : this.radius;
		} // checks if enemy reaches an end of the canvas
	}

	this.death = function (ind) { // ind is index of enemy object in the enemy array
		let character = gameObjects.mainCharacter;
		let sides = {
			left: this.x - this.radius,
			right: this.x + this.radius,
			top: this.y - this.radius,
			death: this.y + this.radius / 2
		}

		if ((sides.left <= character.x && character.x <= sides.right) && (sides.top <= character.y && character.y <= sides.death)) {
			scoreCounter.score += scoreCounter.scoreForEnemy;
			sounds.kill.play();
			gameObjects.enemies.splice(ind, 1);
		} // checks if character above the center and inside an enemy, if yes, deletes an enemy object from the array
	}

	return this;
}

function Camera() {
	this.x = canvasSize.x / 2;

	this.move = function(char) {

		if(char.x <= canvasSize.x / 2) {
			this.x = canvasSize.x / 2;
		} else if(char.x < worldSize - canvasSize.x / 2) {
			this.x = char.x;
		} else {
			this.x = worldSize - canvasSize.x / 2;
		}

	}
}

function mapGenerator(numOfCan) {
	for(let cans = 0; cans < numOfCan; cans++) {
		let width = Math.random() * 250 + 50;
		let borderPad = 150;
		let canyonPad = 100;
		let pos;

		if(gameObjects.canyons.length === 0) {
			pos = Math.random() * (worldSize - borderPad * 2 - width) + borderPad;
		} else {
			for(let ind = 0; ind <= gameObjects.canyons.length; ind++) {
				let start = ind === 0 ? borderPad : gameObjects.canyons[ind-1].x + gameObjects.canyons[ind-1].width + canyonPad;
				let end = ind === gameObjects.canyons.length ? worldSize - borderPad : gameObjects.canyons[ind].x - canyonPad;
				let length = end - start - width;
				if(length >= 0) {
					pos = Math.random() * length + start;
					break;
				}
			}
		}
		if(pos != undefined) {
			gameObjects.canyons.push(new Canyon(pos, width));
			gameObjects.canyons.sort((a, b) => a.x - b.x);
			if(width > 100) {
				let platformPad = 25;
				gameObjects.platforms.push(new Platform(pos + platformPad, 350, width - platformPad * 2, 25, "Green"));
				gameObjects.platforms.sort((a, b) => b.y - a.y);
			}
		}
	}

	for(let ind = 1; ind < gameObjects.canyons.length; ind++) {
		let leftCan = gameObjects.canyons[ind-1];
		let rightCan = gameObjects.canyons[ind];
		let pos = (rightCan.x + leftCan.x + leftCan.width) / 2;
		gameObjects.enemySpawnPoints.push(new Flag(pos, "Red"));
	}
}

function objectGenerator(seconds, enemyLimit) { //random object generator, seconds is how much player has to wait till next object
	let frames = seconds * fps; //frames to wait
	let secondsLeft = Math.ceil((seconds - frameCount % (seconds * fps) / fps)); // seconds left till next object
	textSize(25);
	stroke(0);
	text(`Next object: ${secondsLeft}`, 865, 25);
	if (frameCount % frames === 0) {
		let randAct = Math.round(Math.random());
		if (randAct === 0 || gameObjects.enemies.length === enemyLimit) {
			let coinX = Math.random() * worldSize;
			let coinY = Math.random() * groundBorder;
			let coinSize = Math.random() / 2 + 1;
			gameObjects.coins.push(new Coin(coinX, coinY, 250, coinSize)); // creates new coin with random coords and size
		} else {
			let indFlag = Math.floor(Math.random() * gameObjects.enemySpawnPoints.length);
			let enemyX = gameObjects.enemySpawnPoints[indFlag].x;
			let enemySize = Math.random() / 2 + 1;
			gameObjects.enemies.push(new Enemy(enemyX, 100, enemySize)); // create new enemy with random coords and size
		}
	}
}

function soundVolume(musicVol, sfxVol) { //musicVol is volume of music and sfxVol is volume of sfx
	sounds.music.amp(musicVol * 0.1);
	sounds.coin.amp(sfxVol * 0.5);
	sounds.death.amp(sfxVol * 0.5);
	sounds.fall.amp(sfxVol * 0.25);
	sounds.kill.amp(sfxVol * 0.25);

	if(sounds.music.amp().value === 0 || sounds.music.isPaused()) {
		images.music.hide();
		images.musicOff.show();
	} else {
		images.music.show();
		images.musicOff.hide();
	}
	if(sounds.death.amp().value === 0) {
		images.sound.hide();
		images.soundOff.show();
	} else {
		images.sound.show();
		images.soundOff.hide();
	}
}

function pauseMusic() {
	if (sounds.music.isPlaying()) {
		sounds.music.pause();
	} else {
		sounds.music.play();
	}
}