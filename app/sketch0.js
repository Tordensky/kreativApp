let xRes = window.innerWidth - 50;
let yRes = window.innerHeight - 50;

const NUM_PARTICLES = 30;
let particles = [];

function setup() {
	createCanvas(
		xRes,
		yRes
	);

	for (let n = 0; n < NUM_PARTICLES; n++) {
		let p = new Particle;
		p.init()
		particles.push(p);
	}
}

function draw () {
	background(0);
	particles.map(p => p.update());
	particles.map(p => p.drawLines(particles));
	particles.map(p => p.draw(particles));
}

function Particle() {
	this.init = function() {
		this.pos = createVector(random(0, width), random(0, height));
		this.speed = createVector(random(0, 100), random(0, 100));
	},

	this.update = function() {
		this.speed.x += 0.001;
		this.speed.y += 0.001;
		this.pos.x = map(noise(this.speed.x), 0, 1, 0, width);
		this.pos.y = map(noise(this.speed.y), 0, 1, 0, height);
	},

	this.drawLines = function(other) {
		other.forEach(p => {
			//console.log(map(this.pos.dist(p.pos), 0, width, 0, 255));
			let alpha = map(this.pos.dist(p.pos), 0, 150, 255, 0);
			stroke(255, 255, 200, alpha);
			line(this.pos.x, this.pos.y, p.pos.x, p.pos.y);
		});
	},

	this.draw = function(other) {
		noStroke();
		fill(255, 255, 200);
	  ellipse(this.pos.x, this.pos.y, 2, 2);
	}
}
