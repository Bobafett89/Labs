
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

const groundBorder = 432;
const fps = 60;

const gameObjects = {
	sceneryObjects: [
		new Ground(),

		new Cloud(200, 150, 1),

		new Mountain(500, 1),

		new Tree(900, 1),

		new Flag(425, "Red"),

		new Flag(850, "Red"),

		new Flag(25, "Green")
	],

	canyons: [
		new Canyon(175, 100),

		new Canyon(600, 100)
	],

	coins: [
		new Coin(400, 400, 250, 2),

		new Coin(600, 400, 250, 1)
	],

	enemies: [
		new Enemy(425, 100, 1),

		new Enemy(850, 100, 2)
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
		text(`Score: ${this.score}`, 0, 25);
		text(`High score: ${this.highScore}`, 0, 50);
	}, // draws current and highest score

	checkScore: function () {
		if (this.highScore < this.score) {
			this.highScore = this.score;
		}
	} // rewrites highscore
};

function preload() {
	soundFormats('mp3', 'wav');
	sounds.music = loadSound("/HoliznaCC0 - Game BOI 2.mp3");
	sounds.music.amp(0.15);
	sounds.death = loadSound("/DeathByEnemy.wav");
	sounds.fall = loadSound("/FallIntoCanyon.wav");
	sounds.fall.amp(0.5);
	sounds.kill = loadSound("/EnemyDeath.wav");
	sounds.kill.amp(0.5);
	sounds.coin = loadSound("/Coin.wav");
	sounds.coin.amp(0.75); // loads music and sounds, turns the volume of some sounds down
}

function setup() {
	createCanvas(canvasSize.x, canvasSize.y);
	frameRate(60);
}

function draw() {
	if (!sounds.music.isPlaying()) {
		sounds.music.play();
		sounds.music.loop();
		userStartAudio();
	} // starts and loops the music

	background(100, 155, 255); //fill the sky blue

	gameObjects.sceneryObjects.forEach(object => object.draw()); // draws all background objects

	gameObjects.canyons.forEach(canyon => canyon.draw()); // draws all canyons

	gameObjects.coins.forEach((coin, ind) => (coin.move(), coin.collect(ind), coin.draw())); // moves and draws all coins

	gameObjects.enemies.forEach((enemy, ind) => (enemy.move(), enemy.death(ind), enemy.draw())); // moves, draws and kills all enemies

	(char => (char.move(), char.death(), char.draw()))(gameObjects.mainCharacter); // moves and draws character

	(counter => (counter.checkScore(), counter.draw()))(scoreCounter);

	objectGenerator(3); // generate random object every 3 seconds
}

function Canyon(posX, width) { //posX is coords for top left corner. width is width of a canyon
	this.x = posX;
	this.y = groundBorder;
	this.width = width;
	this.height = canvasSize.y - groundBorder;

	this.draw = function () {
		fill(100);
		rect(this.x, this.y, this.width, this.height);
	}

	return this;
}

function Cloud(posX, posY, size) { //posX and posY are coords for the center of bigger(middle) ellipse. Default size is 1
	this.x = posX;
	this.y = posY;
	this.k = size;

	this.draw = function () {
		fill(255);
		ellipse(this.x, this.y, 100 * this.k, 50 * this.k);
		ellipse(this.x - (50 * this.k), this.y, 60 * this.k, 35 * this.k);
		ellipse(this.x + (50 * this.k), this.y, 60 * this.k, 35 * this.k);
	}

	return this;
}

function Mountain(posX, size) { //posX is coords for bottom left corner. Default size is 1
	this.x = posX;
	this.y = groundBorder;
	this.k = size;

	this.draw = function () {
		fill(100);
		triangle(this.x + (50 * this.k), this.y - (132 * this.k), this.x, this.y, this.x + (100 * this.k), this.y);
		fill(255);
		triangle(this.x + (50 * this.k), this.y - (132 * this.k), this.x + (40 * this.k), this.y - (106 * this.k), this.x + (60 * this.k), this.y - (106 * this.k));
	}

	return this;
}

function Tree(posX, size) { //posX is coords for bottom left corner of a tree trunk. Default size is 1
	this.x = posX;
	this.y = groundBorder;
	this.k = size;

	this.draw = function () {
		fill("brown");
		rect(this.x, this.y - (27 * this.k), 15 * this.k, 27 * this.k);
		fill(0, 155, 0);
		triangle(this.x - (25 * this.k), this.y - (27 * this.k), this.x + (40 * this.k), this.y - (27 * this.k), this.x + (7 * this.k), this.y - (72 * this.k));
		triangle(this.x - (25 * this.k), this.y - (47 * this.k), this.x + (40 * this.k), this.y - (47 * this.k), this.x + (7 * this.k), this.y - (97 * this.k));
		triangle(this.x - (25 * this.k), this.y - (67 * this.k), this.x + (40 * this.k), this.y - (67 * this.k), this.x + (7 * this.k), this.y - (117 * this.k));
	}

	return this;
}

function Ground() {
	this.x = 0;
	this.y = groundBorder;
	this.width = canvasSize.x;
	this.height = canvasSize.y - groundBorder;

	this.draw = function () {
		noStroke();
		fill(0, 155, 0);
		rect(this.x, this.y, this.width, this.height);
	}

	return this;
}

function Flag(posX, color) { //posX is coords for center of pole, color is the colour of the flag
	this.x = posX;
	this.color = color;

	this.draw = function () {
		fill("Brown");
		rect(this.x - 3, groundBorder - 50, 7, 50);
		fill(this.color);
		triangle(this.x + 4, groundBorder - 50, this.x + 4, groundBorder - 26, this.x + 25, groundBorder - 38);
	}
}

function Coin(posX, posY, speed, size) { //posX and posY are coords for the center of a coin, speed is the speed of the coin. Default size is 1
	this.x = posX;
	this.y = posY;
	this.speed = speed;
	this.direction = Math.random() * 2 * Math.PI;
	this.k = size;
	this.radius = 20 * this.k;

	this.draw = function () {
		fill(240, 200, 0);
		circle(this.x, this.y, 2 * this.radius);
		fill(255);
		textSize(25 * this.k);
		text("C", this.x - (10 * this.k), this.y + (10 * this.k));
	}

	this.move = function () {
		if (this.x >= (canvasSize.x - this.radius) || this.x <= this.radius) {
			if (this.direction <= Math.PI) {
				this.direction = Math.PI - this.direction;
			} else {
				this.direction = 3 * Math.PI - this.direction;
			}

			if (this.x <= this.radius) {
				this.x = this.radius;
			} else {
				this.x = canvasSize.x - this.radius;
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

		let sides = {
			left: this.x - this.radius,
			right: this.x + this.radius,
			top: this.y - this.radius,
			bottom: this.y + this.radius
		};

		distX = collectionZone.x - this.x;
		distY = collectionZone.y - this.y

		if ((-(collectionZone.width + this.radius) <= distX && distX <= this.radius) && (-this.radius) <= distY && distY <= (collectionZone.height + this.radius)) {
			scoreCounter.score += scoreCounter.scoreForCoin;
			sounds.coin.play();
			gameObjects.coins.splice(ind, 1);
		}
	}

	return this;
}

function Character() { // coords of this objects are located in the middle of bottom border(end of legs). Height is 70 pixels and width is 22
	this.x = charStarParam.charStartPoint.x;
	this.y = charStarParam.charStartPoint.y;

	this.movement = {
		walkSpeed: charStarParam.movement.walkSpeed,
		walkDirection: 0,
		jumpSpeed: charStarParam.movement.jumpSpeed,
		jumpHeight: charStarParam.movement.jumpHeight,
		velocityY: 0,
		gravityAcc: charStarParam.movement.gravityAcc,
		ableToJump: charStarParam.charStartPoint.y === groundBorder,
		isInAir: !this.ableToJump,
		inCanyon: false
	};

	this.drawStates = {
		drawFront: function () {
			fill("red");
			stroke(0);
			rect(this.x - 10, this.y - 60, 20, 40); //body

			strokeWeight(2);
			line(this.x - 5, this.y - 20, this.x - 5, this.y); //left leg

			line(this.x + 5, this.y - 20, this.x + 5, this.y); //right leg

			line(this.x - 11, this.y - 55, this.x - 11, this.y - 35); //left arm

			line(this.x + 12, this.y - 55, this.x + 12, this.y - 35); //right arm

			strokeWeight(1);
			fill("pink");
			rect(this.x - 5, this.y - 70, 10, 10) //face

			strokeWeight(2);
			point(this.x - 2, this.y - 67)
			point(this.x + 3, this.y - 67) //eyes
		},

		drawRight: function () {
			fill("red");
			stroke(0);
			rect(this.x - 10, this.y - 60, 20, 40); //body

			strokeWeight(2);
			line(this.x - 5, this.y - 20, this.x - 5, this.y); //left leg

			line(this.x + 5, this.y - 20, this.x + 5, this.y); //right leg

			line(this.x - 11, this.y - 55, this.x - 11, this.y - 45);
			line(this.x - 11, this.y - 45, this.x - 1, this.y - 45); //left arm

			line(this.x + 12, this.y - 55, this.x + 12, this.y - 45);
			line(this.x + 12, this.y - 45, this.x + 22, this.y - 45); //right arm

			strokeWeight(1);
			fill("pink");
			rect(this.x - 5, this.y - 70, 10, 10) //face

			strokeWeight(2);
			point(this.x + 3, this.y - 67) //eye
		},

		drawLeft: function () {
			fill("red");
			stroke(0);
			rect(this.x - 10, this.y - 60, 20, 40); //body

			strokeWeight(2);
			line(this.x - 5, this.y - 20, this.x - 5, this.y); //left leg

			line(this.x + 5, this.y - 20, this.x + 5, this.y); //right leg

			line(this.x - 11, this.y - 55, this.x - 11, this.y - 45);
			line(this.x - 11, this.y - 45, this.x - 21, this.y - 45); //left arm

			line(this.x + 12, this.y - 55, this.x + 12, this.y - 45);
			line(this.x + 12, this.y - 45, this.x + 2, this.y - 45); //right arm

			strokeWeight(1);
			fill("pink");
			rect(this.x - 5, this.y - 70, 10, 10) //face

			strokeWeight(2);
			point(this.x - 2, this.y - 67) //eye
		},

		drawJumpFront: function () {
			fill("red");
			stroke(0);
			rect(this.x - 10, this.y - 60, 20, 40); //body

			strokeWeight(2);
			line(this.x - 5, this.y - 20, this.x - 5, this.y); //left leg

			line(this.x + 5, this.y - 20, this.x + 5, this.y); //right leg

			line(this.x - 11, this.y - 55, this.x - 11, this.y - 75); //left arm

			line(this.x + 12, this.y - 55, this.x + 12, this.y - 75); //right arm

			strokeWeight(1);
			fill("pink");
			rect(this.x - 5, this.y - 70, 10, 10) //face

			strokeWeight(2);
			point(this.x - 2, this.y - 67)
			point(this.x + 3, this.y - 67) //eyes
		},

		drawJumpRight: function () {
			fill("red");
			stroke(0);
			rect(this.x - 10, this.y - 60, 20, 40); //body

			strokeWeight(2);
			line(this.x - 5, this.y - 20, this.x - 5, this.y - 10);
			line(this.x - 5, this.y - 10, this.x - 15, this.y - 10); //left leg

			line(this.x + 5, this.y - 20, this.x + 5, this.y - 10);
			line(this.x + 5, this.y - 10, this.x - 5, this.y - 10); //right leg

			line(this.x - 11, this.y - 55, this.x - 11, this.y - 45);
			line(this.x - 11, this.y - 45, this.x - 1, this.y - 45); //left arm

			line(this.x + 12, this.y - 55, this.x + 12, this.y - 45);
			line(this.x + 12, this.y - 45, this.x + 22, this.y - 45); //right arm

			strokeWeight(1);
			fill("pink");
			rect(this.x - 5, this.y - 70, 10, 10) //face

			strokeWeight(2);
			point(this.x + 3, this.y - 67) //eye
		},

		drawJumpLeft: function () {
			fill("red");
			stroke(0);
			rect(this.x - 10, this.y - 60, 20, 40); //body

			strokeWeight(2);
			line(this.x - 5, this.y - 20, this.x - 5, this.y - 10);
			line(this.x - 5, this.y - 10, this.x + 5, this.y - 10); //left leg

			line(this.x + 5, this.y - 20, this.x + 5, this.y - 10);
			line(this.x + 5, this.y - 10, this.x + 15, this.y - 10); //right leg

			line(this.x - 11, this.y - 55, this.x - 11, this.y - 45);
			line(this.x - 11, this.y - 45, this.x - 21, this.y - 45); //left arm

			line(this.x + 12, this.y - 55, this.x + 12, this.y - 45);
			line(this.x + 12, this.y - 45, this.x + 2, this.y - 45); //right arm

			strokeWeight(1);
			fill("pink");
			rect(this.x - 5, this.y - 70, 10, 10) //face

			strokeWeight(2);
			point(this.x - 2, this.y - 67) //eye
		}
	};

	this.move = function () {
		for (i = 0; i < gameObjects.canyons.length; i++) {
			let canyon = gameObjects.canyons[i];
			if ((this.x - 11) > canyon.x && (this.x + 11) < (canyon.x + canyon.width) && this.y >= groundBorder) { // ±11 is offset for arms
				this.movement.inCanyon = true;
				this.movement.isInAir = true;
			}
		} // checks if player should fall into canyon

		if (keyIsDown(68) && !this.movement.inCanyon && this.x < canvasSize.x - 11) {
			this.movement.walkDirection = 1;
		} else if (keyIsDown(65) && !this.movement.inCanyon && this.x > 11) {
			this.movement.walkDirection = -1;
		} else {
			this.movement.walkDirection = 0;
		} // checks which direction character should walk

		if (keyIsDown(32) && this.movement.ableToJump && !this.movement.inCanyon) { // keycode 32 is for space
			this.movement.velocityY = -this.movement.jumpSpeed;
			this.movement.isInAir = true;
			if (this.y <= (groundBorder - this.movement.jumpHeight)) {
				this.movement.ableToJump = false;
			}
		} else if (this.movement.isInAir || this.movement.inCanyon) {
			this.movement.velocityY += this.movement.gravityAcc / frameRate();
			this.movement.ableToJump = false;
			if (this.y >= groundBorder && !this.movement.inCanyon) {
				this.movement.ableToJump = true;
				this.movement.isInAir = false;
				this.movement.velocityY = 0;
				this.y = groundBorder;
			} else if (this.y >= canvasSize.y) {
				sounds.fall.play();
				this.reset();
			}
		} // checks if character should jump or fall

		this.x += this.movement.walkSpeed * this.movement.walkDirection / frameRate();
		this.y += this.movement.velocityY / frameRate();
	};

	this.death = function () {
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
				this.reset();
			}
		}
	}

	this.draw = function () {
		if (this.movement.isInAir) {
			switch (this.movement.walkDirection) {
				case 0:
					this.drawStates.drawJumpFront.bind(this)();
					break;
				case 1:
					this.drawStates.drawJumpRight.bind(this)();
					break;
				case -1:
					this.drawStates.drawJumpLeft.bind(this)();
					break;
			}
		} else {
			switch (this.movement.walkDirection) {
				case 0:
					this.drawStates.drawFront.bind(this)();
					break;
				case 1:
					this.drawStates.drawRight.bind(this)();
					break;
				case -1:
					this.drawStates.drawLeft.bind(this)();
					break;
			}
		}
	};

	this.reset = function () {
		this.movement.ableToJump = true;
		this.movement.isInAir = false;
		this.movement.velocityY = 0;
		this.x = charStarParam.charStartPoint.x;
		this.y = charStarParam.charStartPoint.y;
		this.movement.inCanyon = false;
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

	this.draw = function () {
		fill(225, 0, 0);
		circle(this.x, this.y, 2 * this.radius);
		fill(255);
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

		if (this.x < this.radius || this.x > (canvasSize.x - this.radius)) {
			this.directionX *= -1;
			this.x = (this.directionX === -1) ? (canvasSize.x - this.radius) : this.radius;
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

function objectGenerator(seconds) { //random object generator, seconds is how much player has to wait till next object
	let frames = seconds * fps; //frames to wait
	let secondsLeft = Math.ceil((seconds - frameCount % (seconds * fps) / fps)); // seconds left till next object
	textSize(25);
	text(`Next object: ${secondsLeft}`, 865, 25);
	if (frameCount % frames === 0) {
		let randAct = Math.round(Math.random());
		if (randAct === 0 || gameObjects.enemies.length === 3) {
			let coinX = Math.random() * canvasSize.x;
			let coinY = Math.random() * groundBorder;
			let coinSize = Math.random() / 2 + 1;
			gameObjects.coins.push(new Coin(coinX, coinY, 250, coinSize)); // creates new coin with random coords and size
		} else {
			let enemyX = (Math.round(Math.random()) + 1) * 425;
			let enemySize = Math.random() / 2 + 1;
			gameObjects.enemies.push(new Enemy(enemyX, 100, enemySize)); // create new enemy with random coords and size
		}
	}
}