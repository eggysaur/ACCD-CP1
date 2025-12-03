

let grassList = [];
let preyList = [];
let predatorList = [];

function setup() {
    let container = document.getElementById('canvas-container');
    let canvas = createCanvas(container.clientWidth, container.clientHeight);
    canvas.parent('canvas-container');
    colorMode(HSB);
    // Initial population
    for (let i = 0; i < 100; i++) {
        grassList.push(new Grass(random(width), random(height)));
}
}

function draw() {
    background(220);

}

function windowResized() {
    let container = document.getElementById('canvas-container');
    resizeCanvas(container.clientWidth, container.clientHeight);
}