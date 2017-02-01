let xRes = window.innerWidth - 50;
let yRes = window.innerHeight - 50;

const NUM_PARTICLES = 20;
let particles = [];

const BOX_SIZE = 400;

function setup() {
	//createCanvas(xRes, yRes, WEBGL);
	createCanvas(
		xRes,
		yRes,
		WEBGL
	);

	for (let n = 0; n < NUM_PARTICLES; n++) {
		let p = new Particle;
		p.init()
		particles.push(p);
	}
}

function draw () {
	background(0);

  ambientLight(100, 80, 80);
  pointLight(200, 200, 200, 30, 30, 0);

	particles.map(p => p.update());
	particles.map(p => p.drawLines(particles));
	particles.map(p => p.draw(particles));
}

function Particle() {
	this.init = function() {
		//this.pos = createVector(random(-BOX_SIZE, BOX_SIZE), random(-BOX_SIZE, BOX_SIZE), random(-BOX_SIZE, BOX_SIZE));
		this.pos = createVector(random(-BOX_SIZE, BOX_SIZE), random(-BOX_SIZE, BOX_SIZE), 0);
		this.speed = createVector(random(0, 100), random(0, 100), random(0, 100));
	},

	this.update = function() {
		this.speed.x += 0.005;
		this.speed.y += 0.005;
		this.speed.z += 0.01;
		this.pos.x = map(noise(this.speed.x), 0, 1, -BOX_SIZE, BOX_SIZE);
		this.pos.y = map(noise(this.speed.y), 0, 1, -BOX_SIZE, BOX_SIZE);
		this.pos.z = map(noise(this.speed.z), 0, 1, -BOX_SIZE, BOX_SIZE*1.5);
	},

	this.drawLines = function(other) {
		translate(this.pos.x, this.pos.y, this.pos.z-100);
		other.forEach(p => {
			push();

			if (this.pos !== p.pos) {
				let dist = this.pos.dist(p.pos);
				push();
				rotateZ(angle(this.pos.x, this.pos.y, p.pos.x, p.pos.y));
				rotateY(angle(this.pos.x, this.pos.z, p.pos.x, p.pos.z));
				rotateX(angle(this.pos.y, this.pos.z, p.pos.y, p.pos.z));
				translate(0, 10, 0);

				specularMaterial(255, 255, 255)
				cylinder(2, 20);
				pop();
			}
		});

		ambientMaterial(255, 155, 0);
		sphere(10);
	},

	this.draw = function(other) {
	}
}

function angle(p1, p2, a1, a2) {
	let v1 = createVector(p1, p2);
	let v2 = createVector(a1, a2);
	return p5.Vector.angleBetween(v1, v2);
}
