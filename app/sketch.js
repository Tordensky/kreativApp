let xRes = window.innerWidth - 50;
let yRes = window.innerHeight - 50;


let particles = [];

const SPACING = 60;
const NUM_PER_COL = 30;
const NUM_ROWS = 20;
const NUM_PARTICLES = NUM_PER_COL * NUM_ROWS;

const WAVE_AMPLITUDE = 250;

const SPHERE_RADIUS = 12;

let moonSurface;
let earthSurface;
let bg;
let cloudSurface;
function preload(){
  bg = loadImage('../images/moon.jpg');
  moonSurface = loadImage('../images/moon.jpg');
  earthSurface = loadImage('../images/earth.jpg');
  cloudSurface = loadImage('../images/cloud.png');
}

function setup() {
	console.log(cloudSurface.blend(earthSurface, 0, 0, 33, 100, 67, 0, 33, 100, LIGHTEST));
	createCanvas(
		xRes,
		yRes,
		WEBGL
	);

	for (let n = 0; n < NUM_PARTICLES; n++) {
		let p = new Particle;
		p.init(n)
		particles.push(p);
	}
}

let r = 90;
function draw () {
	r += 0.5;
	//background(0);
  ambientLight(20, 20, 20);
  pointLight(255, 255, 255, 30, 10, 0);

	//rotateX(radians(r));

	translate(0, 0, -1000);

	push();
	rotateY(radians(r/10));
	texture(earthSurface);
	//ambientMaterial(0, 0, 200, 100);
	sphere(200);
	pop();


	rotateZ(radians(-10));
	rotateY(radians(r*-0.3));

	translate(1000, 0, 0);
	texture(moonSurface);
	sphere(30);

	// particles.map(p => p.update());
	// particles.map(p => p.draw(particles));
}

function Particle() {
	this.init = function(idx) {
		this.idx = idx;
		this.column = (idx % NUM_PER_COL);
		this.row = floor(idx / NUM_PER_COL);
		this.pos = createVector(this.column * SPACING, 0, this.row * SPACING);
		this.speed = createVector(0, 100, 0);
	},

	this.update = function() {
		this.speed.y += 0.025;
		this.pos.y = map(sin(this.speed.y + (this.row * 0.2) + (this.column * 0.3 * cos(this.speed.y))), 0, 1, 0, WAVE_AMPLITUDE * (this.column / NUM_PER_COL));
	},

	this.draw = function() {
		push();
		translate(this.pos.x - (NUM_PER_COL * SPACING) / 2, this.pos.y + 200, this.pos.z - (NUM_ROWS * SPACING));
		let value = map(this.pos.y, 0, WAVE_AMPLITUDE, 200, 255);
		colorMode(HSB, 255);

		ambientMaterial(value, value, 255);
		sphere(SPHERE_RADIUS);
		pop();
	}
}
