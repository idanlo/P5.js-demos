let wave;
let env;

let notes = [];
let blackNotes = [];
let slider;
let soundStarted = false;

function setup() {
    createCanvas(1000, 600);
    let x = 31.25;

    for (let i = 0; i < keys.length; i += 4) {
        let isBlack = blacks.find(n => n === keys[i]) ? true : false;
        if (isBlack) {
            blackNotes.push(
                new Note(
                    x - 20,
                    keys[i],
                    keys[i + 1],
                    1,
                    keys[i + 2],
                    keys[i + 3]
                )
            );
        } else {
            notes.push(
                new Note(x, keys[i], keys[i + 1], 0, keys[i + 2], keys[i + 3])
            );
        }

        if (!isBlack) {
            x += 62.5;
        }
    }
}

function draw() {
    background(51);

    for (let note of notes) {
        note.draw();
    }
    for (let note of blackNotes) {
        note.draw();
    }
}

function keyPressed() {
    if (!soundStarted) {
        env = new p5.Envelope();
        env.setADSR(0.02, 0.1, 0.5, 1);
        env.setRange(0.8, 0);

        wave = new p5.Oscillator();

        wave.setType("sine");
        wave.start();
        wave.freq(523.25);
        wave.amp(env);
        soundStarted = true;
    }
    for (let note of notes) {
        // both I (73) and Z (90) can hit the C5 note
        if (keyCode === 73 && note.keyCode === 90) {
            note.play();
        } else if (keyCode === note.keyCode) {
            note.play();
        }
    }
    for (let note of blackNotes) {
        if (keyCode === note.keyCode) {
            note.play();
        }
    }
}

class Note {
    constructor(x, keyCode, freq, type, keyText, charText) {
        this.x = x;
        this.keyCode = keyCode;
        this.freq = freq;
        this.type = type;
        this.keyText = keyText;
        this.charText = charText;
    }

    draw() {
        if (this.active) {
            fill(50);
        } else {
            fill(255);
        }
        stroke(0);
        if (this.type === 0) {
            rect(this.x, 0, 62.5, height - 1);
            textSize(16);
            fill(0);
            noStroke();
            text(
                this.keyText,
                this.x + 31.25 - textWidth(this.keyText) / 2,
                height - 200
            );
            textSize(14);
            text(
                this.charText,
                this.x + 31.25 - textWidth(this.charText) / 2,
                height - 180
            );
        } else if (this.type === 1) {
            if (!this.active) fill(0);
            stroke(255);
            rect(this.x, 0, 40, height / 2 - 1);
            textSize(14);
            fill(255);
            noStroke();
            text(this.keyText, this.x + 20 - textWidth(this.keyText) / 2, 180);
            textSize(12);
            text(
                this.charText,
                this.x + 20 - textWidth(this.charText) / 2,
                200
            );
        }
    }

    play() {
        wave.freq(this.freq);
        env.play();
        this.active = true;
        setTimeout(() => {
            this.active = false;
        }, 250);
    }
}
