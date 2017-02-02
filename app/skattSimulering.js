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
    soknaderMssSisteVindu += Math.floor(random(-10, 10));
    if (soknaderMssSisteVindu < 10) {
        soknaderMssSisteVindu = 10;
    }
    if (soknaderMssSisteVindu > MAX_NODES) {
        soknaderMssSisteVindu = MAX_NODES;
    }
}
setInterval(randomSoknaderSisteVindu, 20000);


let applicationData = [
    {
        navn: "Saksbehandling Forskudd",
        status: STATUS_OK,
        reqPerSec: 0.5,
        logError: [2, 100, 6, 8, 7, 2, 3 ,20 ,5, 20, 40, 50],
        driftIntern: 0,
        driftAmazon: 0,
        brukere: 0,
    },
    {
        navn: "Oppdragsregister",
        status: STATUS_WARN,
        reqPerSec: 5.0,
        logError: [2, 0, 6, 0, 7, 0, 0 ,0 ,5, 20, 40, 50],
        driftIntern: 0,
        driftAmazon: 0,
        brukere: 0,
    },
    {
        navn: "MinSkatteside Backend",
        status: STATUS_OK,
        reqPerSec: 2.0,
        logError: [0, 0, 0, 0, 0, 2, 0 ,0 ,0, 0, 0, 0],
        driftIntern: 0,
        driftAmazon: 0,
        brukere: 0,
    },
    {
        navn: "Skattepliksvurdering",
        status: STATUS_FATAL,
        reqPerSec: 0.0,
        logError: [2, 100, 6, 8, 7, 2, 3 ,20 ,5, 20, 40, 50],
        driftIntern: 0,
        driftAmazon: 0,
        brukere: 1,
    },
];

function randomAppSimuler() {
    applicationData.forEach(app => {
        app.reqPerSec = app.status !== STATUS_FATAL  ? +( constrain(random(-1, 1) + app.reqPerSec, 0, 5) ).toFixed(1) : 0;
        if (app.logError.length > 15) {
            app.logError.shift();
        }
        app.logError.push(Math.floor(random(0, 70)));

        app.driftIntern += Math.floor(random(0, 200));
        app.driftAmazon += Math.floor(random(0, 2));

        app.brukere = Math.floor(app.reqPerSec / 0.2);
    });
}
setInterval(randomAppSimuler, 2000);

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

        if (reqPerSec === 0) {
            return;
        }

        const speed = 130 / frameRate() * reqPerSec;

        this.currentPos += speed;
        if (this.currentPos > 130) {
            this.currentPos = 0;
        }

        fill(100, 100, 100, map(this.currentPos, 0, 5, 50, 100));
        rect(this.pos.x + this.currentPos, this.pos.y - 4, 10, 8)
    }
}

const MAX_BAR_HEIGHT = 100;
const BAR_WIDTH = 6;
function ErrorLog(x, y) {
    this.pos = createVector(x + 180, y - MAX_BAR_HEIGHT + 20);

    this.updateAndDraw = function(log) {
        log.forEach((entry, idx) => {
            const posX = this.pos.x + (idx * BAR_WIDTH) +10 ;
            const barHeight = constrain(entry, 2, MAX_BAR_HEIGHT);
            fill(80, 0, 0);
            rect(posX, (this.pos.y + MAX_BAR_HEIGHT - barHeight ), BAR_WIDTH, barHeight);
        });
    }
}

function Kroner(x, y) {
    this.pos = createVector(x, y);

    this.formaterTusenskille = function(verdi) {
        const verdiFormatert = parseInt(verdi, 0).toFixed(0);
        return !isNaN(verdiFormatert) ? verdiFormatert.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '';
    },

    this.updateAndDraw = function(driftIntern, driftAmazon) {
        fill(96, 96, 96);

        textAlign(CENTER);
        textSize(16);
        text("Estimert driftskostnad", this.pos.x, this.pos.y + 90, 300);

        textSize(16);
        text("Intern drift", this.pos.x, this.pos.y + 120, 150);
        text("Amazon", this.pos.x + 150, this.pos.y + 120, 150);

        textSize(20);
        fill(188, 188, 188);
        text(this.formaterTusenskille(driftIntern) + " kr", this.pos.x, this.pos.y + 150, 150);
        text(this.formaterTusenskille(driftAmazon) + " kr", this.pos.x + 150, this.pos.y + 150, 150);
    }
}

function Brukere(x, y) {
    this.pos = createVector(x, y);

    this.updateAndDraw = function(brukere = 0) {
        fill(96, 96, 96);

        textAlign(CENTER);
        textSize(14);
        text("Pålogget", this.pos.x, this.pos.y - 50, 150);
        textSize(25);
        fill(188, 188, 188);
        text(brukere, this.pos.x, this.pos.y - 20, 150);
    }
}

function Applikasjon(navn) {
    this.navn = navn;
    this.init = function(posx, posy) {
        this.pos = createVector(posx, posy);
        this.requestCounter = new RequestCounter(posx, posy);
        this.errorLog = new ErrorLog(posx, posy);
        this.kroner = new Kroner(posx, posy);
        this.brukere = new Brukere(posx, posy);
    },

    this.updateAndDraw = function(data) {
        fill(2, 140, 204);

        textAlign(CENTER);
        textSize(25);
        text(this.navn, this.pos.x, this.pos.y + 60, 300);

        stroke(126);
        line(this.pos.x, this.pos.y  + 30, this.pos.x + 300, this.pos.y + 30);
        stroke(0);

        this.requestCounter.updateAndDraw(data.reqPerSec);
        this.errorLog.updateAndDraw(data.logError);
        this.kroner.updateAndDraw(data.driftIntern, data.driftAmazon);
        this.brukere.updateAndDraw(data.brukere);

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
        const oppChange = this.aktiv ? 5 : -5;
        this.opacity = constrain(this.opacity + oppChange, 0, 255);

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
            let alpha = map(this.pos.dist(p.pos), 0, 150, 150, 0);
            stroke(155, 155, 100, alpha);
            line(this.pos.x, this.pos.y, p.pos.x, p.pos.y);
        });
    },

    this.draw = function (other) {
        noStroke();
        fill(10, 255, 180, this.opacity);
        ellipse(this.pos.x, this.pos.y, 10, 10);
    }
}
