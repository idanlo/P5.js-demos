const TILE_WIDTH = 90;
const TILE_HEIGHT = 150;
let tiles = [];
let score = 0;
let env;
let wave;
let soundStarted = false;
let noteCounter = 0;
let scrollSpeed = 5;
let frameGap = 32;
let scrollSpeedIncreaser;
let frameGapDecreaser;

function setup() {
    createCanvas(360, 600);
    tiles.push(new Tile(1));
    textSize(32);
}

function draw() {
    background(51);
    fill(255);
    stroke(0);
    text(score, width / 2 - textWidth(score) / 2, 50);
    if (frameCount % frameGap == 0) {
        tiles.push(
            random(1) < 0.25
                ? new StarTile(round(random(3)))
                : new Tile(round(random(3)))
        );
    }
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i]) {
            tiles[i].update();
            tiles[i].draw();
            if (tiles[i].y > height - 100) {
                if (!tiles[i].checked) {
                    score -= tiles[i].score;
                }
                // for some resaon doing splice makes it look laggy, so i chose a different way to delete tiles
                // tiles.splice(i, 1);
                tiles[i] = null;
            }
        }
    }
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === null) {
            tiles.splice(i, 1);
        }
    }
    stroke(255);
    line(0, height - 100, width, height - 100);

    if (
        score > 500 &&
        !frameGapDecreaser &&
        !scrollSpeedIncreaser &&
        scrollSpeed < 7.5 &&
        frameGap > 22
    ) {
        frameGapDecreaser = new Decreaser(frameGap, 22);
        scrollSpeedIncreaser = new Increaser(scrollSpeed, 7.5);
    } else if (
        score > 2000 &&
        !frameGapDecreaser &&
        !scrollSpeedIncreaser &&
        scrollSpeed < 10 &&
        frameGap > 16
    ) {
        frameGapDecreaser = new Decreaser(frameGap, 16);
        scrollSpeedIncreaser = new Increaser(scrollSpeed, 10);
    } else if (
        score > 5000 &&
        !frameGapDecreaser &&
        !scrollSpeedIncreaser &&
        scrollSpeed < 12.5 &&
        frameGap > 12
    ) {
        frameGapDecreaser = new Decreaser(frameGap, 13);
        scrollSpeedIncreaser = new Increaser(scrollSpeed, 12.5);
    }

    if (frameGapDecreaser) {
        frameGapDecreaser.update();
        frameGap = frameGapDecreaser.value;
        if (frameGapDecreaser.finished) {
            frameGapDecreaser = null;
        }
    }

    if (scrollSpeedIncreaser) {
        scrollSpeedIncreaser.update();
        scrollSpeed = scrollSpeedIncreaser.value;
        if (scrollSpeedIncreaser.finished) {
            scrollSpeedIncreaser = null;
        }
    }
}

function touchStarted() {
    if (!soundStarted) {
        getAudioContext().resume();
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

    let i = 0;
    // get to the first not-checked tile and store it's index in the variable i
    while (i < tiles.length && tiles[i].checked) {
        i++;
    }
    let tileX = tiles[i].pos * TILE_WIDTH;
    if (
        !tiles[i].checked &&
        mouseX >= tileX &&
        mouseX <= tileX + TILE_WIDTH &&
        mouseY >= tiles[i].y &&
        mouseY <= tiles[i].y + TILE_HEIGHT
    ) {
        wave.freq(song[noteCounter]);
        env.play();
        noteCounter++;
        if (noteCounter === song.length) {
            noteCounter = 0;
        }
        score += tiles[i].score;
        tiles[i].checked = true;
    }
}

function keyPressed() {
    if (!soundStarted) {
        getAudioContext().resume();
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
    if (keyCode === 65 || keyCode === 83 || keyCode === 68 || keyCode === 70) {
        let currPos;
        if (keyCode === 65) currPos = 0;
        else if (keyCode === 83) currPos = 1;
        if (keyCode === 68) currPos = 2;
        else if (keyCode === 70) currPos = 3;
        let i = 0;
        // get to the first not-checked tile and store it's index in the variable i
        while (i < tiles.length && tiles[i].checked) {
            i++;
        }
        // check if the value of variable i is not bigger than the length of the list, then if the key and note are correct, play the sound and check the note
        if (i < tiles.length && !tiles[i].checked && tiles[i].pos === currPos) {
            wave.freq(song[noteCounter]);
            env.play();
            noteCounter++;
            if (noteCounter === song.length) {
                noteCounter = 0;
            }
            score += tiles[i].score;
            tiles[i].checked = true;
        }
    }
}

class Tile {
    constructor(pos) {
        this.pos = pos;
        this.y = -TILE_HEIGHT;
        // this.y = height - 200;
        // this.y = y;
        this.checked = false;
        this.score = 25;
    }

    update() {
        this.y += scrollSpeed;
    }

    draw() {
        fill(255);
        stroke(0);
        if (this.checked) {
            fill(100);
        }
        rect(this.pos * TILE_WIDTH, this.y, TILE_WIDTH, TILE_HEIGHT);
    }
}

class StarTile extends Tile {
    constructor(props) {
        super(props); // get all properties from the Tile class
        this.score = 50;
    }

    draw() {
        fill(255, 255, 0);
        stroke(0);
        if (this.checked) {
            fill(160, 160, 0);
        }
        rect(this.pos * TILE_WIDTH, this.y, TILE_WIDTH, TILE_HEIGHT);
    }
}

class Increaser {
    constructor(value, destination) {
        this.value = value;
        this.destination = destination;
        this.finished = false;
    }

    update() {
        if (!this.finished) {
            this.value += 0.5;

            if (this.value >= this.destination) {
                this.finished = true;
            }
        }
    }
}

class Decreaser extends Increaser {
    update() {
        if (!this.finished) {
            this.value -= 0.5;

            if (this.value <= this.destination) {
                this.finished = true;
            }
        }
    }
}
