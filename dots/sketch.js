var dots = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight - 4); // no scroll bar
    for (var i = 0; i < 200; i++) {
        dots.push(new Dot());
    }
}

function draw() {
    background(51);

    for (var i = 0; i < dots.length; i++) {
        dots[i].update();
        dots[i].show();

        for (var j = 0; j < dots.length; j++) {
            if (dots[i] !== dots[j]) {
                var d = dist(
                    dots[i].pos.x,
                    dots[i].pos.y,
                    dots[j].pos.x,
                    dots[j].pos.y
                );
                if (d < 75) {
                    stroke(255, d * 0.5);
                    line(
                        dots[i].pos.x,
                        dots[i].pos.y,
                        dots[j].pos.x,
                        dots[j].pos.y
                    );
                }
            }
        }

        var d = dist(mouseX, mouseY, dots[i].pos.x, dots[i].pos.y);
        if (d < 100) {
            stroke(200, 200);
            line(mouseX, mouseY, dots[i].pos.x, dots[i].pos.y);
        }
    }
}

function Dot() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();

    this.update = function() {
        if (this.pos.x < 0 || this.pos.x > width) {
            this.vel.x = -this.vel.x;
        }
        if (this.pos.y < 0 || this.pos.y > height) {
            this.vel.y = -this.vel.y;
        }
        this.pos.add(this.vel);
    };

    this.show = function() {
        fill(255);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 3, 3);
    };
}
