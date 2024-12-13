
let charStarParam = {
	charStartPoint: {
		x: 25,
		y: 432
	},
	movement: {
		walkSpeed: 200,
		jumpSpeed: 400,
		jumpHeight: 100
	}
}; // starting paramaters of the main character

let gameObjects = {
	sceneryObjects: [
		new Ground(0, 432, 1024, 144),

		new Cloud(200, 150, 1),

		new Mountain(500, 432, 1),

		new Tree(900, 432, 1)
	],

	canyons: [
		new Canyon(175, 432, 100, 144),

		new Canyon(600, 432, 100, 144)
	],

	coins: [
		new Coin(400, 400, 250, undefined, 1),

		new Coin(600, 400, 250, undefined, 1)
	],

	enemies: [
		new Enemy(350, 400, 100, 1, 1),

		new Enemy(800, 400, 100, 1, 1)
	],

	mainCharacter: new Character()
}

function setup()
{
	createCanvas(1024, 576);
	gameObjects.coins.forEach(coin => (coin.direction = random(0, 2 * PI))); // random direction for each coin
}

function draw()
{
	background(100, 155, 255); //fill the sky blue

	gameObjects.sceneryObjects.forEach(obj => obj.draw()); // draws all background objects

	gameObjects.canyons.forEach(obj => obj.draw()); // draws all canyons

	gameObjects.coins.forEach(coin => (coin.move(), coin.draw())); // moves and draws all coins

	gameObjects.enemies.forEach((enemy, ind) => (enemy.move(), enemy.draw(), enemy.death(ind))); // moves, draws and kills all enemies

	(char => (char.move(), char.draw()))(gameObjects.mainCharacter); // moves and draws character
}


function Canyon(posX, posY, width, height) { //posX and posY are coords for top left corner. width and height are width and height of a canyon respectively
	this.x = posX;
	this.y = posY;
	this.width = width;
	this.height = height;

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

function Mountain(posX, posY, size) { //posX and posY are coords for bottom left corner. Default size is 1
	this.x = posX;
	this.y = posY;
	this.k = size;

	this.draw = function() {
		fill(100);
		triangle(this.x + (50 * this.k), this.y - (132 * this.k), this.x, this.y, this.x + (100 * this.k), this.y);
		fill(255);
		triangle(this.x + (50 * this.k), this.y - (132 * this.k), this.x + (40 * this.k), this.y - (106 * this.k), this.x + (60 * this.k), this.y - (106 * this.k));
	}

	return this;
}

function Tree(posX, posY, size) { //posX and posY are coords for bottom left corner of a tree trunk. Default size is 1
	this.x = posX;
	this.y = posY;
	this.k = size;

	this.draw = function() {
		fill("brown");
		rect(this.x, this.y - (27 * this.k), 15 * this.k, 27 * this.k);
		fill(0, 155, 0);
		triangle(this.x - (25 * this.k), this.y - (27 * this.k), this.x + (40 * this.k), this.y - (27 * this.k), this.x + (7 * this.k), this.y - (72 * this.k));
		triangle(this.x - (25 * this.k), this.y - (47 * this.k), this.x + (40 * this.k), this.y - (47 * this.k), this.x + (7 * this.k), this.y - (97 * this.k));
		triangle(this.x - (25 * this.k), this.y - (67 * this.k), this.x + (40 * this.k), this.y - (67 * this.k), this.x + (7 * this.k), this.y - (117 * this.k));
	}

	return this;
}

function Ground(posX, posY, width, height) { //posX and posY are coords for top left corner
	this.x = posX;
	this.y = posY;
	this.width = width;
	this.height = height;

	this.draw = function() {
		noStroke();
		fill(0,155,0);
		rect(this.x, this.y, this.width, this.height);
	}

	return this;
}

function Coin(posX, posY, speed, direction, size) { //posX and posY are coords for the center of a coin. Default size is 1
	this.coords = {
		x: posX,
		y: posY
	};
	this.speed = speed;
	this.direction = direction;
	this.isMoving = true;
	this.k = size;

	this.draw = function() {
		fill(240, 200, 0);
		circle(this.coords.x, this.coords.y, 40 * this.k);
		fill(255);
		textSize(25 * this.k);
		text("C", this.coords.x - (10 * this.k), this.coords.y + (10 * this.k));
	}

	this.move = function() {
		if(this.coords.x >= 1024 || this.coords.x <= 0) {
			if(this.direction <= PI) {
				this.direction = PI - this.direction;
			} else {
				this.direction = 3 * PI - this.direction;
			}
	
			if(this.coords.x <= 0) {
				this.coords.x = 0;
			} else {
				this.coords.x = 1024;
			}
		} // if it hits vertical border, change horizontal direction
	
		if(this.coords.y >= 432 || this.coords.y <= 0) {
			this.direction = 2 * PI - this.direction;
	
			if(this.coords.y <= 0) {
				this.coords.y = 0;
			} else {
				this.coords.y = 432;
			}
		} // if it hits horizontal border, change vertical direction
	
		let axisSpeed = {
			x: this.speed * cos(this.direction) / frameRate(),
			y: this.speed * sin(this.direction) / frameRate()
		} // individual speed for each axis
	
		if(this.isMoving) {
			this.coords.x += axisSpeed.x;
			this.coords.y += axisSpeed.y;
		} // moves coin
	}
}

function Character() {
	this.coords = {
		x: charStarParam.charStartPoint.x,
		y: charStarParam.charStartPoint.y
	};

	this.movement = {
		walkSpeed: charStarParam.movement.walkSpeed,
		walkDirection: 0,
		jumpSpeed: charStarParam.movement.jumpSpeed,
		jumpHeight: charStarParam.movement.jumpHeight,
		ableToJump: charStarParam.charStartPoint.y === 432,
		isInAir: !this.ableToJump,
		jumpDirection: 0,
		inCanyon: false
	};

	this.drawStates = {
		drawFront: function() {
			fill("red");
			stroke(0);
			rect(this.coords.x-10, this.coords.y-60, 20, 40); //body
		
			strokeWeight(2);
			line(this.coords.x-5, this.coords.y-20, this.coords.x-5, this.coords.y); //left leg
		
			line(this.coords.x+5, this.coords.y-20, this.coords.x+5, this.coords.y); //right leg
		
			line(this.coords.x-11, this.coords.y-55, this.coords.x-11, this.coords.y-35); //left arm
		
			line(this.coords.x+12, this.coords.y-55, this.coords.x+12, this.coords.y-35); //right arm
		
			strokeWeight(1);
			fill("pink");
			rect(this.coords.x-5, this.coords.y-70, 10, 10) //face
		
			strokeWeight(2);
			point(this.coords.x-2, this.coords.y-67)
			point(this.coords.x+3, this.coords.y-67) //eyes
		},
		
		drawRight: function() {
			fill("red");
			stroke(0);
			rect(this.coords.x-10, this.coords.y-60, 20, 40); //body
		
			strokeWeight(2);
			line(this.coords.x-5, this.coords.y-20, this.coords.x-5, this.coords.y); //left leg
		
			line(this.coords.x+5, this.coords.y-20, this.coords.x+5, this.coords.y); //right leg
		
			line(this.coords.x-11, this.coords.y-55, this.coords.x-11, this.coords.y-45);
			line(this.coords.x-11, this.coords.y-45, this.coords.x-1, this.coords.y-45); //left arm
		
			line(this.coords.x+12, this.coords.y-55, this.coords.x+12, this.coords.y-45);
			line(this.coords.x+12, this.coords.y-45, this.coords.x+22, this.coords.y-45); //right arm
		
			strokeWeight(1);
			fill("pink");
			rect(this.coords.x-5, this.coords.y-70, 10, 10) //face
		
			strokeWeight(2);
			point(this.coords.x+3, this.coords.y-67) //eye
		},
		
		drawLeft: function() {
			fill("red");
			stroke(0);
			rect(this.coords.x-10, this.coords.y-60, 20, 40); //body
		
			strokeWeight(2);
			line(this.coords.x-5, this.coords.y-20, this.coords.x-5, this.coords.y); //left leg
		
			line(this.coords.x+5, this.coords.y-20, this.coords.x+5, this.coords.y); //right leg
		
			line(this.coords.x-11, this.coords.y-55, this.coords.x-11, this.coords.y-45); 
			line(this.coords.x-11, this.coords.y-45, this.coords.x-21, this.coords.y-45); //left arm
		
			line(this.coords.x+12, this.coords.y-55, this.coords.x+12, this.coords.y-45);
			line(this.coords.x+12, this.coords.y-45, this.coords.x+2, this.coords.y-45); //right arm
		
			strokeWeight(1);
			fill("pink");
			rect(this.coords.x-5, this.coords.y-70, 10, 10) //face
		
			strokeWeight(2);
			point(this.coords.x-2, this.coords.y-67) //eye
		},

		drawJumpFront: function() {
			fill("red");
			stroke(0);
			rect(this.coords.x-10, this.coords.y-60, 20, 40); //body
		
			strokeWeight(2);
			line(this.coords.x-5, this.coords.y-20, this.coords.x-5, this.coords.y); //left leg
		
			line(this.coords.x+5, this.coords.y-20, this.coords.x+5, this.coords.y); //right leg
		
			line(this.coords.x-11, this.coords.y-55, this.coords.x-11, this.coords.y-75); //left arm
		
			line(this.coords.x+12, this.coords.y-55, this.coords.x+12, this.coords.y-75); //right arm
		
			strokeWeight(1);
			fill("pink");
			rect(this.coords.x-5, this.coords.y-70, 10, 10) //face
		
			strokeWeight(2);
			point(this.coords.x-2, this.coords.y-67)
			point(this.coords.x+3, this.coords.y-67) //eyes
		},
		
		drawJumpRight: function() {
			fill("red");
			stroke(0);
			rect(this.coords.x-10, this.coords.y-60, 20, 40); //body
		
			strokeWeight(2);
			line(this.coords.x-5, this.coords.y-20, this.coords.x-5, this.coords.y-10);
			line(this.coords.x-5, this.coords.y-10, this.coords.x-15, this.coords.y-10); //left leg
		
			line(this.coords.x+5, this.coords.y-20, this.coords.x+5, this.coords.y-10);
			line(this.coords.x+5, this.coords.y-10, this.coords.x-5, this.coords.y-10); //right leg
		
			line(this.coords.x-11, this.coords.y-55, this.coords.x-11, this.coords.y-45);
			line(this.coords.x-11, this.coords.y-45, this.coords.x-1, this.coords.y-45); //left arm
		
			line(this.coords.x+12, this.coords.y-55, this.coords.x+12, this.coords.y-45);
			line(this.coords.x+12, this.coords.y-45, this.coords.x+22, this.coords.y-45); //right arm
		
			strokeWeight(1);
			fill("pink");
			rect(this.coords.x-5, this.coords.y-70, 10, 10) //face
		
			strokeWeight(2);
			point(this.coords.x+3, this.coords.y-67) //eye
		},
		
		drawJumpLeft: function() {
			fill("red");
			stroke(0);
			rect(this.coords.x-10, this.coords.y-60, 20, 40); //body
		
			strokeWeight(2);
			line(this.coords.x-5, this.coords.y-20, this.coords.x-5, this.coords.y-10);
			line(this.coords.x-5, this.coords.y-10, this.coords.x+5, this.coords.y-10); //left leg
		
			line(this.coords.x+5, this.coords.y-20, this.coords.x+5, this.coords.y-10);
			line(this.coords.x+5, this.coords.y-10, this.coords.x+15, this.coords.y-10); //right leg
		
			line(this.coords.x-11, this.coords.y-55, this.coords.x-11, this.coords.y-45);
			line(this.coords.x-11, this.coords.y-45, this.coords.x-21, this.coords.y-45); //left arm
		
			line(this.coords.x+12, this.coords.y-55, this.coords.x+12, this.coords.y-45);
			line(this.coords.x+12, this.coords.y-45, this.coords.x+2, this.coords.y-45); //right arm
		
			strokeWeight(1);
			fill("pink");
			rect(this.coords.x-5, this.coords.y-70, 10, 10) //face
		
			strokeWeight(2);
			point(this.coords.x-2, this.coords.y-67) //eye
		}
	};

	this.move = function() {
		for(i = 0; i < gameObjects.canyons.length; i++) {
			let canyon = gameObjects.canyons[i];
			if((this.coords.x - 11) > canyon.x && (this.coords.x + 11) < (canyon.x + canyon.width) && this.coords.y >= 432) {
				this.movement.inCanyon = true;
				this.movement.isInAir = true;
			}
		} // checks if player should fall into canyon

		if(keyIsDown(68) && !this.movement.inCanyon) {
			this.movement.walkDirection = 1;
		} else if(keyIsDown(65) && !this.movement.inCanyon) {
			this.movement.walkDirection = -1;
		} else {
			this.movement.walkDirection = 0;
		} // checks which direction character should walk
	
		if(keyIsDown(32) && this.movement.ableToJump && !this.movement.inCanyon) {
			this.movement.jumpDirection = 1;
			this.movement.isInAir = true;
			if(this.coords.y <= (432 - this.movement.jumpHeight)) {
				this.movement.ableToJump = false;
			}
		} else if(this.movement.isInAir || this.movement.inCanyon) {
			this.movement.jumpDirection = -1;
			this.movement.ableToJump = false;
			if(this.coords.y >= 432 && !this.movement.inCanyon) {
				this.movement.ableToJump = true;
				this.movement.isInAir = false;
				this.movement.jumpDirection = 0;
				this.coords.y = 432;
			} else if(this.coords.y >= 576) {
				this.movement.ableToJump = true;
				this.movement.isInAir = false;
				this.movement.jumpDirection = 0;
				this.coords.x = charStarParam.charStartPoint.x;
				this.coords.y = charStarParam.charStartPoint.y;
				this.movement.inCanyon = false;
			}
		} // checks if character should jump or fall
	
		this.coords.x += this.movement.walkSpeed * this.movement.walkDirection / frameRate();
		this.coords.y += this.movement.jumpSpeed * -this.movement.jumpDirection / frameRate();
	};

	this.draw = function() {
		if(this.movement.isInAir) {
			switch(this.movement.walkDirection) {
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
			switch(this.movement.walkDirection) {
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

	return this;	
}

function Enemy(posX, posY, speed, directionX, size) { //posX and posY are coords for the center of an enemy. directionX is the direction on an x-axis where 1 is right and -1 is left. Default size is 1
	this.x = posX;
	this.y = posY;
	this.speed = speed;
	this.directionX = directionX;
	this.k = size;
	this.inCanyon = false;
	this.radius = 40;

	this.move = function() {
		this.x += this.speed * this.directionX / frameRate();

		for(i = 0; i < gameObjects.canyons.length; i++) {
			let canyon = gameObjects.canyons[i];
			let leftSide = canyon.x;
			let rightSide = canyon.x + canyon.width;

			if(this.x > leftSide && this.x < rightSide) {
				this.directionX *= -1;
				this.x = (this.directionX === -1) ? leftSide : rightSide;
			} // checks if enemy reaches a canyon
		}

		if(this.x < 0 || this.x > 1024) {
			this.directionX *= -1;
			this.x = (this.directionX === -1) ? 1024 : 0;
		} // checks if enemy reaches an end of the canvas
	}

	this.draw = function() {
		fill("Red");
		circle(this.x, this.y, this.radius * this.k);
		fill(255);
		textSize(25 * this.k);
		text("E", this.x - (8 * this.k), this.y + (9 * this.k));
	}
	
	this.death = function(ind) { // ind is index of enemy object in the enemy array
		let character = gameObjects.mainCharacter;
		let leftSide = this.x - this.radius * this.k;
		let rightSide = this.x + this.radius * this.k;
		let topSide = this.y - this.radius * this.k;

		if((character.coords.x > leftSide && character.coords.x < rightSide) && (character.coords.y > topSide && character.coords.y < this.y)) {
			gameObjects.enemies.splice(ind, 1);
		} // checks if character above the center and inside an enemy, if yes, deletes an enemy object from the array
	}

	return this;
}