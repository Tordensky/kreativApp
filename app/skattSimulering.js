let xRes = window.innerWidth - 50;
let yRes = window.innerHeight - 50;

const MAX_NODES = 100;
let particles = [];


// Mock data for soknader siste timen
let soknaderMssSisteVindu = 20;
function randomSoknaderSisteVindu() {
    soknaderMssSisteVindu += Math.floor(random(-5, 5));
    if (soknaderMssSisteVindu < 0) {
        soknaderMssSisteVindu = 0;
    }
    if (soknaderMssSisteVindu > MAX_NODES) {
        soknaderMssSisteVindu = MAX_NODES;
    }
}
setInterval(randomSoknaderSisteVindu, 5000);


function setup() {
    createCanvas(
        xRes,
        yRes
    );

    for (let n = 0; n < MAX_NODES; n++) {
        let p = new SoknadNode;
        p.init();
        particles.push(p);
    }
}

function draw() {
    background(0);
    OppdaterSisteSoknader();
}

function OppdaterSisteSoknader() {
    particles.map((p, idx) => {
        const aktiv = idx <= soknaderMssSisteVindu;
        p.setAktiv(aktiv);
    });
    particles.map(p => p.update());
    particles.map(p => p.drawLines(particles));
    particles.map(p => p.draw(particles));
}

function SoknadNode() {
    this.init = function () {
        this.opacity = 0;
        this.aktiv = false;
        this.pos = createVector(random(0, width), random(0, height));
        this.speed = createVector(random(0, 100), random(0, 100));
    },

    this.setAktiv = function(aktiv) {
        this.aktiv = aktiv;
    },

    this.update = function () {
        const oppChange = this.aktiv ? 2 : -2;
        this.opacity = constrain(this.opacity + oppChange, 0, 100);

        this.speed.x += 0.001;
        this.speed.y += 0.001;
        this.pos.x = map(noise(this.speed.x), 0, 1, 0, width);
        this.pos.y = map(noise(this.speed.y), 0, 1, 0, height);
    },

    this.drawLines = function (other) {
        other.forEach(p => {
            if (!this.aktiv || !p.aktiv) {
                return;
            }
            //console.log(map(this.pos.dist(p.pos), 0, width, 0, 255));
            let alpha = map(this.pos.dist(p.pos), 0, 150, 255, 0);
            stroke(255, 255, 200, alpha);
            line(this.pos.x, this.pos.y, p.pos.x, p.pos.y);
        });
    },

    this.draw = function (other) {
        noStroke();
        fill(100, 255, 150, this.opacity);
        ellipse(this.pos.x, this.pos.y, 15, 15);
    }
}
