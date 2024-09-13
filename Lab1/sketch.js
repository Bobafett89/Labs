/*

The Game Project

1 - Background Scenery

Use p5 drawing functions such as rect, ellipse, line, triangle and
point to draw the scenery as set out in the code comments. The items
should appear next to the text titles.

Each bit of scenery is worth two marks:

0 marks = not a reasonable attempt
1 mark = attempted but it's messy or lacks detail
2 marks = you've used several shape functions to create the scenery

I've given titles and chosen some base colours, but feel free to
imaginatively modify these and interpret the scenery titles loosely to
match your game theme.


WARNING: Do not get too carried away. If you're shape takes more than 5 lines
of code to draw then you've probably over done it.


*/

function setup()
{
	createCanvas(1024, 576);
}

function draw()
{
	background(100, 155, 255); //fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, 432, 1024, 144); //draw some green ground

	//1. a cloud in the sky
	//... add your code here

	fill(255);
	ellipse(200, 150, 100, 50);
	ellipse(150, 150, 60, 35);
	ellipse(250, 150, 60, 35);

	noStroke();
	fill(255);
	text("cloud", 200, 100);

	//2. a mountain in the distance
	//... add your code here

	fill(100);
	triangle(550, 300, 500, 432, 600, 432);
	fill(255);
	triangle(550, 300, 540, 326, 560, 326);

	noStroke();
	fill(255);
	text("mountain", 500, 256);

	//3. a tree
	//... add your code here

	fill("brown");
	rect(900, 405, 15, 27);
	fill(0, 155, 0);
	triangle(875, 405, 940, 405, 907, 360);
	triangle(875, 385, 940, 385, 907, 340);
	triangle(875, 365, 940, 365, 907, 320);

	noStroke();
	fill(255);
	text("tree", 800, 346);

	//4. a canyon
	//NB. the canyon should go from ground-level to the bottom of the screen

	//... add your code here

	fill(100);
	quad(175, 432, 275, 432, 235, 576, 215, 576);


	noStroke();
	fill(255);
	text("canyon", 100, 480);

	//5. a collectable token - eg. a jewel, fruit, coins
	//... add your code here

	fill(240, 200, 0);
	ellipse(350, 400, 40, 40);
	fill(255);
	textSize(25);
	text("C", 340, 410)
	textSize(12);

	noStroke();
	fill(255);
	text("collectable item", 400, 400);

	circle(50, 50, 25);
}
