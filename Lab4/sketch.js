
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
		function drawGround() {
			noStroke();
			fill(0,155,0);
			rect(0, 432, 1024, 144);
		},

		function drawCloud() {
			fill(255);
			ellipse(200, 150, 100, 50);
			ellipse(150, 150, 60, 35);
			ellipse(250, 150, 60, 35);
		},

		function drawMountain() {
			fill(100);
			triangle(550, 300, 500, 432, 600, 432);
			fill(255);
			triangle(550, 300, 540, 326, 560, 326);
		},

		function drawTree() {
			fill("brown");
			rect(900, 405, 15, 27);
			fill(0, 155, 0);
			triangle(875, 405, 940, 405, 907, 360);
			triangle(875, 385, 940, 385, 907, 340);
			triangle(875, 365, 940, 365, 907, 320);
		},

		function drawCanyon() {
			fill(100);
			quad(175, 432, 275, 432, 235, 576, 215, 576);
		}
	],

	coins: [
		{
			direction: 0,
			speed: 250,
			isMoving: true,
			coords: {
				x: 400,
				y: 400
			},
			drawCoin() {
				fill(240, 200, 0);
				circle(this.coords.x, this.coords.y, 40);
				fill(255);
				textSize(25);
				text("C", this.coords.x-10, this.coords.y+10)
				textSize(12);
			}
		},

		{
			direction: 0,
			speed: 250,
			isMoving: true,
			coords: {
				x: 200,
				y: 200
			},
			drawCoin() {
				fill(240, 200, 0);
				circle(this.coords.x, this.coords.y, 40);
				fill(255);
				textSize(25);
				text("C", this.coords.x-10, this.coords.y+10)
				textSize(12);
			}
		}
	],

	mainCharacter: {
		coords: {
			x: charStarParam.charStartPoint.x,
			y: charStarParam.charStartPoint.y
		},

		drawFunctions: {
			drawCharFront() {
				let gameChar = {
					x: gameObjects.mainCharacter.coords.x,
					y: gameObjects.mainCharacter.coords.y
				};
			
				fill("red");
				stroke(0);
				rect(gameChar.x-10, gameChar.y-60, 20, 40); //body
			
				strokeWeight(2);
				line(gameChar.x-5, gameChar.y-20, gameChar.x-5, gameChar.y); //left leg
			
				line(gameChar.x+5, gameChar.y-20, gameChar.x+5, gameChar.y); //right leg
			
				line(gameChar.x-11, gameChar.y-55, gameChar.x-11, gameChar.y-35); //left arm
			
				line(gameChar.x+12, gameChar.y-55, gameChar.x+12, gameChar.y-35); //right arm
			
				strokeWeight(1);
				fill("pink");
				rect(gameChar.x-5, gameChar.y-70, 10, 10) //face
			
				strokeWeight(2);
				point(gameChar.x-2, gameChar.y-67)
				point(gameChar.x+3, gameChar.y-67) //eyes
			},
			
			drawCharRight() {
				let gameChar = {
					x: gameObjects.mainCharacter.coords.x,
					y: gameObjects.mainCharacter.coords.y
				};
			
				fill("red");
				stroke(0);
				rect(gameChar.x-10, gameChar.y-60, 20, 40); //body
			
				strokeWeight(2);
				line(gameChar.x-5, gameChar.y-20, gameChar.x-5, gameChar.y); //left leg
			
				line(gameChar.x+5, gameChar.y-20, gameChar.x+5, gameChar.y); //right leg
			
				line(gameChar.x-11, gameChar.y-55, gameChar.x-11, gameChar.y-45);
				line(gameChar.x-11, gameChar.y-45, gameChar.x-1, gameChar.y-45); //left arm
			
				line(gameChar.x+12, gameChar.y-55, gameChar.x+12, gameChar.y-45);
				line(gameChar.x+12, gameChar.y-45, gameChar.x+22, gameChar.y-45); //right arm
			
				strokeWeight(1);
				fill("pink");
				rect(gameChar.x-5, gameChar.y-70, 10, 10) //face
			
				strokeWeight(2);
				point(gameChar.x+3, gameChar.y-67) //eye
			},
			
			drawCharLeft() {
				let gameChar = {
					x: gameObjects.mainCharacter.coords.x,
					y: gameObjects.mainCharacter.coords.y
				};
			
				fill("red");
				stroke(0);
				rect(gameChar.x-10, gameChar.y-60, 20, 40); //body
			
				strokeWeight(2);
				line(gameChar.x-5, gameChar.y-20, gameChar.x-5, gameChar.y); //left leg
			
				line(gameChar.x+5, gameChar.y-20, gameChar.x+5, gameChar.y); //right leg
			
				line(gameChar.x-11, gameChar.y-55, gameChar.x-11, gameChar.y-45); 
				line(gameChar.x-11, gameChar.y-45, gameChar.x-21, gameChar.y-45); //left arm
			
				line(gameChar.x+12, gameChar.y-55, gameChar.x+12, gameChar.y-45);
				line(gameChar.x+12, gameChar.y-45, gameChar.x+2, gameChar.y-45); //right arm
			
				strokeWeight(1);
				fill("pink");
				rect(gameChar.x-5, gameChar.y-70, 10, 10) //face
			
				strokeWeight(2);
				point(gameChar.x-2, gameChar.y-67) //eye
			},
			
			drawCharJumpFront() {
				let gameChar = {
					x: gameObjects.mainCharacter.coords.x,
					y: gameObjects.mainCharacter.coords.y
				};
			
				fill("red");
				stroke(0);
				rect(gameChar.x-10, gameChar.y-60, 20, 40); //body
			
				strokeWeight(2);
				line(gameChar.x-5, gameChar.y-20, gameChar.x-5, gameChar.y); //left leg
			
				line(gameChar.x+5, gameChar.y-20, gameChar.x+5, gameChar.y); //right leg
			
				line(gameChar.x-11, gameChar.y-55, gameChar.x-11, gameChar.y-75); //left arm
			
				line(gameChar.x+12, gameChar.y-55, gameChar.x+12, gameChar.y-75); //right arm
			
				strokeWeight(1);
				fill("pink");
				rect(gameChar.x-5, gameChar.y-70, 10, 10) //face
			
				strokeWeight(2);
				point(gameChar.x-2, gameChar.y-67)
				point(gameChar.x+3, gameChar.y-67) //eyes
			},
			
			drawCharJumpRight() {
				let gameChar = {
					x: gameObjects.mainCharacter.coords.x,
					y: gameObjects.mainCharacter.coords.y
				};
			
				fill("red");
				stroke(0);
				rect(gameChar.x-10, gameChar.y-60, 20, 40); //body
			
				strokeWeight(2);
				line(gameChar.x-5, gameChar.y-20, gameChar.x-5, gameChar.y-10);
				line(gameChar.x-5, gameChar.y-10, gameChar.x-15, gameChar.y-10); //left leg
			
				line(gameChar.x+5, gameChar.y-20, gameChar.x+5, gameChar.y-10);
				line(gameChar.x+5, gameChar.y-10, gameChar.x-5, gameChar.y-10); //right leg
			
				line(gameChar.x-11, gameChar.y-55, gameChar.x-11, gameChar.y-45);
				line(gameChar.x-11, gameChar.y-45, gameChar.x-1, gameChar.y-45); //left arm
			
				line(gameChar.x+12, gameChar.y-55, gameChar.x+12, gameChar.y-45);
				line(gameChar.x+12, gameChar.y-45, gameChar.x+22, gameChar.y-45); //right arm
			
				strokeWeight(1);
				fill("pink");
				rect(gameChar.x-5, gameChar.y-70, 10, 10) //face
			
				strokeWeight(2);
				point(gameChar.x+3, gameChar.y-67) //eye
			},
			
			drawCharJumpLeft() {
				let gameChar = {
					x: gameObjects.mainCharacter.coords.x,
					y: gameObjects.mainCharacter.coords.y
				};
			
				fill("red");
				stroke(0);
				rect(gameChar.x-10, gameChar.y-60, 20, 40); //body
			
				strokeWeight(2);
				line(gameChar.x-5, gameChar.y-20, gameChar.x-5, gameChar.y-10);
				line(gameChar.x-5, gameChar.y-10, gameChar.x+5, gameChar.y-10); //left leg
			
				line(gameChar.x+5, gameChar.y-20, gameChar.x+5, gameChar.y-10);
				line(gameChar.x+5, gameChar.y-10, gameChar.x+15, gameChar.y-10); //right leg
			
				line(gameChar.x-11, gameChar.y-55, gameChar.x-11, gameChar.y-45);
				line(gameChar.x-11, gameChar.y-45, gameChar.x-21, gameChar.y-45); //left arm
			
				line(gameChar.x+12, gameChar.y-55, gameChar.x+12, gameChar.y-45);
				line(gameChar.x+12, gameChar.y-45, gameChar.x+2, gameChar.y-45); //right arm
			
				strokeWeight(1);
				fill("pink");
				rect(gameChar.x-5, gameChar.y-70, 10, 10) //face
			
				strokeWeight(2);
				point(gameChar.x-2, gameChar.y-67) //eye
			}
		},

		movement: {
			walkSpeed: charStarParam.movement.walkSpeed,
			walkDirection: 0,
			jumpSpeed: charStarParam.movement.jumpSpeed,
			jumpHeight: charStarParam.movement.jumpHeight,
			ableToJump: charStarParam.charStartPoint.y === 432,
			isInAir: !this.ableToJump,
			jumpDirection: 0
		}
	}
}

function setup()
{
	createCanvas(1024, 576);
	gameObjects.coins.forEach(coin => (coin.direction = random(0, 2 * PI))); // random direction for each coin
}

function draw()
{
	background(100, 155, 255); //fill the sky blue

	gameObjects.sceneryObjects.forEach(obj => obj()); // draws all background objects

	gameObjects.coins.forEach(coin => coinMove(coin)); // moves and draws all coins

	characterMovement(); // moves and draws character
}

function characterMovement() {
	const character = gameObjects.mainCharacter;

	if(keyIsDown(68)) {
		character.movement.walkDirection = 1;
	} else if(keyIsDown(65)) {
		character.movement.walkDirection = -1;
	} else {
		character.movement.walkDirection = 0;
	} // checks which direction character should walk

	if(keyIsDown(32) && character.movement.ableToJump) {
		character.movement.jumpDirection = 1;
		character.movement.isInAir = true;
		if(character.coords.y <= (432 - character.movement.jumpHeight)) {
			character.movement.ableToJump = false;
		}
	} else if(character.movement.isInAir === true) {
		character.movement.jumpDirection = -1;
		character.movement.ableToJump = false;
		if(character.coords.y >= 432) {
			character.movement.ableToJump = true;
			character.movement.isInAir = false;
			character.movement.jumpDirection = 0;
			character.coords.y = 432;
		}
	} // checks if character should jump or fall

	character.coords.x += character.movement.walkSpeed * character.movement.walkDirection / frameRate();
	character.coords.y += character.movement.jumpSpeed * -character.movement.jumpDirection / frameRate(); // moves character

	if(character.movement.isInAir) {
		switch(character.movement.walkDirection) {
			case 0: 
				character.drawFunctions.drawCharJumpFront();
				break;
			case 1:
				character.drawFunctions.drawCharJumpRight();
				break;
			case -1:
				character.drawFunctions.drawCharJumpLeft();
				break;
		}
	} else {
		switch(character.movement.walkDirection) {
			case 0: 
				character.drawFunctions.drawCharFront();
				break;
			case 1:
				character.drawFunctions.drawCharRight();
				break;
			case -1:
				character.drawFunctions.drawCharLeft();
				break;
		}
	} // draws character
}

function coinMove(coin)
{
	if(coin.coords.x >= 1024 || coin.coords.x <= 0) {
		if(coin.direction <= PI) {
			coin.direction = PI - coin.direction;
		} else {
			coin.direction = 3 * PI - coin.direction;
		}

		if(coin.coords.x <= 0) {
			coin.coords.x = 0;
		} else {
			coin.coords.x = 1024;
		}
	} // if it hits horizontal border, change horizontal direction

	if(coin.coords.y >= 576 || coin.coords.y <= 0) {
		coin.direction = 2 * PI - coin.direction;

		if(coin.coords.y <= 0) {
			coin.coords.y = 0;
		} else {
			coin.coords.y = 576;
		}
	} // if it hits vertical border, change vertical direction

	let axisSpeed = {
		x: coin.speed * cos(coin.direction) / frameRate(),
		y: coin.speed * sin(coin.direction) / frameRate()
	} // individual speed for each axis

	if(coin.isMoving) {
		coin.coords.x += axisSpeed.x;
		coin.coords.y += axisSpeed.y;
	} // moves coin

	coin.drawCoin(); // draws coin
}

function keyPressed() {
	if(keyCode === 81) {
		for(let i = 0; i < gameObjects.coins.length; i++) {
			const coin = gameObjects.coins[i];
			if(coin.direction <= PI) {
				coin.direction += PI;
			} else {
				coin.direction -= PI;
			}
		}
	} // if 'Q' pressed, change directon of coins

	if(keyCode === 69) {
		gameObjects.coins.forEach(coin => coin.isMoving = !coin.isMoving)
	} // if 'E 'pressed, stop coins
}




