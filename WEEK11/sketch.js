

let grassList = [];
let preyList = [];
let predatorList = [];

function setup() {
    let container = document.getElementById('canvas-container');
    let canvas = createCanvas(container.clientWidth, container.clientHeight);
    canvas.parent('canvas-container');

    // Initial population
    for (let i = 0; i < 50; i++) {
        grassList.push(new Grass(random(width), random(height)));
    }
    for (let i = 0; i < 15; i++) {
        preyList.push(new Prey(random(width), random(height)));
    }
    for (let i = 0; i < 5; i++) {
        predatorList.push(new Predator(random(width), random(height)));
    }
}

function draw() {
    background(220);

    // Grass logic
    for (let i = grassList.length - 1; i >= 0; i--) {
        grassList[i].grow();
        grassList[i].display();
        let newGrass = grassList[i].spread();
        if (newGrass) grassList.push(newGrass);
        if (grassList[i].isDead()) grassList.splice(i, 1);
    }

    // Prey logic
    for (let i = preyList.length - 1; i >= 0; i--) {
        let prey = preyList[i];
        if (prey.age === undefined) prey.age = 0;
        prey.age++;
        // Only move every 5 seconds (300 frames at 60fps)
        if (frameCount % 300 === 0 && grassList.length > 0) {
            let nearest = null;
            let minDist = Infinity;
            for (let g of grassList) {
                let d = dist(prey.x, prey.y, g.x, g.y);
                if (d < minDist) {
                    minDist = d;
                    nearest = g;
                }
            }
            if (nearest) {
                prey.seek(nearest);
            }
        }
        // Otherwise, stay still
        prey.eat(grassList);
        prey.display();
        let baby = prey.breed();
        if (baby) preyList.push(baby);
        if (prey.isDead()) preyList.splice(i, 1);
    }

    // Predator logic
    for (let i = predatorList.length - 1; i >= 0; i--) {
        let predator = predatorList[i];
        if (predator.age === undefined) predator.age = 0;
        predator.age++;
        // Only move every 10 seconds (600 frames at 60fps)
        if (frameCount % 600 === 0 && preyList.length > 0) {
            let nearest = null;
            let minDist = Infinity;
            for (let p of preyList) {
                let d = dist(predator.x, predator.y, p.x, p.y);
                if (d < minDist) {
                    minDist = d;
                    nearest = p;
                }
            }
            if (nearest) {
                predator.seek(nearest);
            }
        }
        // Otherwise, stay still
        predator.eat(preyList);
        predator.display();
        let baby = predator.breed();
        if (baby) predatorList.push(baby);
        if (predator.isDead()) predatorList.splice(i, 1);
    }
}

function windowResized() {
    let container = document.getElementById('canvas-container');
    resizeCanvas(container.clientWidth, container.clientHeight);
}