let points = 0;
let blobs = [];
let deleteBlob = false;
let getPoints = false;
let sideBarSize = 0.1;
let gameWidth;
let gameHeight;

var maxDistance;
var mouseClickPos;
var mouseReleasedPos;
let projectiles = [];
let projectileSpeed = 0.05;
let shootTimer = 200; // I millisekunder
let shootTime = 0;
let shooting = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	frameRate(60);
	gameWidth = width * sideBarSize;

	// createVector måste var inne i setup av någon anledning
	maxDistance = createVector(200,200);
	mouseClickPos = createVector(0,0);
	mouseReleasedPos = createVector(0,0);

	setInterval(generate, 1000)
}

function draw() {
  background(0);
  updateUI();
  updateGame();
}


function generate(){
	let newBlob = new Blob(random(gameWidth, width), random(height),random(-2,2), random(-2,2), 32);
  	blobs.push(newBlob);

}

function Blob(xpos, ypos, xvel, yvel, size){
	this.xpos = xpos;
  	this.ypos = ypos;
  	this.xvel = xvel;
  	this.yvel = yvel;
  	this.size = size;
}

function Projectile(xpos, ypos, xvel, yvel, size){
	this.xpos = xpos;
  	this.ypos = ypos;
  	this.xvel = xvel;
  	this.yvel = yvel;
  	this.size = size;
}


function updateUI(){
	fill(123,123,123);
	rect(0, 0, gameWidth, height)
	// Points
	fill(200,200,200);
	textAlign(CENTER);
	textSize(32);
	stroke(0,0,0,100);
	strokeWeight(5);
	strokeJoin(ROUND);
	text("Points: " + points, gameWidth / 2, 50);


}

function updateGame(){
	fill(255,255,255);
	noStroke();
	// FOR BLOBS LOOP
	for (i = 0; i < blobs.length; i++){
		deleteBlob = false;
		getPoints = false;
		blobs[i].xpos += blobs[i].xvel;
		blobs[i].ypos += blobs[i].yvel;
		ellipse(blobs[i].xpos, blobs[i].ypos, blobs[i].size);
		// Check Collision With Mouse
		/*if (dist(mouseX, mouseY, blobs[i].xpos, blobs[i].ypos) < blobs[i].size / 2){
		print ("Colliding!");
		deleteBlob = true;
		getPoints = true;
		}*/
		// Check If Outside Of Canvas
		outOfCanvas(blobs[i]);

		if (deleteBlob){
			if (getPoints){
				points ++;
			}
			
			blobs.splice(i,1);
		}
	}

	// FOR PROJECTILES LOOP
	fill(145, 13, 24);
	for (i = 0; i < projectiles.length; i++){
		deleteBlob = false;
		projectiles[i].xpos += projectiles[i].xvel;
		projectiles[i].ypos += projectiles[i].yvel;
		ellipse(projectiles[i].xpos, projectiles[i].ypos, projectiles[i].size)
		

		outOfCanvas(projectiles[i]);
	}


	// Check Collision with Projectile and Blob. sammanfog alla for loops om lagg??
	for (b = 0; b < blobs.length; b++){
		for (p = 0; p < projectiles.length; p++){
			if (dist(blobs[b].xpos, blobs[b].ypos, projectiles[p].xpos, projectiles[p].ypos) < blobs[b].size / 2 + projectiles[p].size / 2){
				print ("Colliding!!!!!!!!");
				points ++;
				blobs.splice(b,1);
				projectiles.splice(p,1);
			}
		}
	}


	// Shoot Projectiles
	shootTime -= (1000/frameRate());
	if (mouseIsPressed) {
		if (!shooting){
			getClickPos();
			shooting = true;
		}

		if (shootTime <= 0){
			shootTime = shootTimer;
			shoot();
		}
	}
	else {
		shooting = false;
	}

}

function getClickPos(){
	mouseClickPos.x = mouseX;
	mouseClickPos.y = mouseY;

}
/*
function mousePressed(){
	print ("mousePressed: " + mouseX + " " + mouseY);
	getClickPos();

}

function mouseReleased(){
	shoot();

	
}
*/

function shoot(){
	print ("mouseReleased: " + mouseX + " " + mouseY);
	mouseReleasedPos.x = mouseX;
	mouseReleasedPos.y = mouseY;

	var distance = mouseReleasedPos.dist(mouseClickPos);
	distance = min(200, distance);
	
	var distancePos = mouseReleasedPos.sub(mouseClickPos);
	distancePos = distancePos.normalize();
	
	var speed = (distance / 4) * projectileSpeed * 4;
	var velocity = distancePos.mult(speed);

	//print ("distance " + distance);
	//print ("distancePos " + distancePos);
	//print ("velocity " + velocity);

	

	if (distancePos.mag() > 0.2) {
		let projectile = new Projectile(mouseClickPos.x, mouseClickPos.y, velocity.x, velocity.y, 32);
		projectiles.push(projectile);
	}
}

function outOfCanvas(thing){
	if (thing.xpos < 0 - thing.size || thing.xpos > width + thing.size
	|| thing.ypos < 0 - thing.size || thing.ypos > height + thing.size){
		//print ("DELETE");
		//deleteBlob = true;
	}
}