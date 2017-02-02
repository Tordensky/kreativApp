let xRes = window.innerWidth - 50;
let yRes = window.innerHeight - 50;

const MAX_NODES = 100;
let particles = [];

const applications = [];



const STATUS_WARN = "warn";
const STATUS_FATAL = "fatal";
const STATUS_OK = "ok";

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


let applicationData = [
    {
        navn: "Saksbehandling Forskudd",
        status: STATUS_OK,
        reqPerSec: 0.5,
    },
    {
        navn: "Oppdragsregister",
        status: STATUS_WARN,
        reqPerSec: 5.0,
    },
    {
        navn: "MinSkatteside Backend",
        status: STATUS_OK,
        reqPerSec: 2.0,
    },
    {
        navn: "Skattepliksvurdering",
        status: STATUS_FATAL,
        reqPerSec: 0.0,
    },
];

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

    applicationData.map((appData, idx) => {
        const app = new Applikasjon(appData.navn);
        app.init(400 * idx + 50, yRes - 300);
        applications.push(app);
    });
}

function draw() {
    background(0);
    OppdaterSisteSoknader();
    applications.map((a, idx) => a.updateAndDraw(applicationData[idx]));
}

function OppdaterSisteSoknader() {
    particles.map((p, idx) => {
        const aktiv = idx <= soknaderMssSisteVindu;
        p.setAktiv(aktiv);
    });
    particles.map(p => p.update());
    particles.map(p => p.drawLines(particles));
    particles.map(p => p.draw(particles));
    fill(200, 200, 200);
    textAlign(CENTER);
    textSize(20);
    text("Søknader mottatt fra MinSkatteside siste 15min", 0, 20, width);
}

function RequestCounter(x, y) {
    this.pos = createVector(x + 20, y);
    this.currentPos = 0;

    this.updateAndDraw = function(reqPerSec) {
        fill(188, 188, 188);
        textSize(16);
        text(reqPerSec + " REQ/SEC", this.pos.x + 50, this.pos.y + 20);

        const speed = 130 / frameRate() * reqPerSec;

        this.currentPos += speed;
        if (this.currentPos > 130) {
            this.currentPos = 0;
        }



        fill(0, 183, 134, map(this.currentPos, 0, 5, 50, 100));
        rect(this.pos.x + this.currentPos, this.pos.y - 4, 8, 8)
    }
}

function Applikasjon(navn) {
    this.navn = navn;
    this.init = function(posx, posy) {
        this.pos = createVector(posx, posy);
        this.requestCounter = new RequestCounter(posx, posy);
    },

    this.updateAndDraw = function(data) {
        fill(188, 188, 188);

        textAlign(CENTER);
        textSize(25);
        text(this.navn, this.pos.x, this.pos.y + 60, 300);

        stroke(126);
        line(this.pos.x, this.pos.y  + 30, this.pos.x + 300, this.pos.y + 30);
        stroke(0);

        this.requestCounter.updateAndDraw(data.reqPerSec);

        if (data.status === STATUS_WARN) {
            fill(150, 102, 0);
        } else if (data.status === STATUS_FATAL) {
            fill(150, 0, 0);
        } else {
            fill(74, 155, 41);
        }
        ellipse(this.pos.x + 150, this.pos.y, 35, 35);
    }
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
        this.pos.y = map(noise(this.speed.y), 0, 1, 0, height / 2);
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
        ellipse(this.pos.x, this.pos.y, 10, 10);
    }
}
