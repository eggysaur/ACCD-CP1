// Helper: check if a tile is occupied by any predator
function isTileOccupiedByPredator(i, j) {
    let tileX = grassList[i][j].x;
    let tileY = grassList[i][j].y;
    let tileSize = grassList[i][j].size;
    for (let predator of predatorList) {
        let px = predator.x;
        let py = predator.y;
        if (abs(px - (tileX + tileSize / 2)) < 1 && abs(py - (tileY + tileSize / 2)) < 1) {
            return true;
        }
    }
    return false;
}

function placePredator(i, j, predator) {
    if (!isTileOccupiedByPredator(i, j)) {
        let x = grassList[i][j].x + grassList[i][j].size / 2;
        let y = grassList[i][j].y + grassList[i][j].size / 2;
        predator.move(x, y);
    }
}

function showPredators() {
    for (let predator of predatorList) {
        predator.display();
    }
}

function get2Prey(x, y, predator) {
    // convert pixel coordinates to tile indices
    let i = floor(x / (size + 2));
    let j = floor(y / (size + 2));

    // Find the tile with the most energetic prey in range
    let bestK = -1;
    let bestEnergy = -Infinity;
    let bestI = -1, bestJ = -1;
    for (let k = 0; k < preyList.length; k++) {
        let prey = preyList[k];
        let pi = floor(prey.x / (size + 2));
        let pj = floor(prey.y / (size + 2));
        let d = dist(i, j, pi, pj);
        if (d <= 5 && prey.energy > bestEnergy && !isTileOccupiedByPredator(pi, pj)) {
            bestEnergy = prey.energy;
            bestK = k;
            bestI = pi;
            bestJ = pj;
        }
    }
    if (bestK !== -1 && bestI !== -1 && bestJ !== -1) {
        placePredator(bestI, bestJ, predator);
    }
}
// Adjustable rate for grass depletion per ms per prey
let GRASS_DEPLETION_RATE = 0.001;
// Helper: check if a tile is occupied by any prey
function isTileOccupied(i, j) {
    let tileX = grassList[i][j].x;
    let tileY = grassList[i][j].y;
    let tileSize = grassList[i][j].size;
    for (let prey of preyList) {
        let px = prey.x;
        let py = prey.y;
        // Check if prey is centered on this tile
        if (abs(px - (tileX + tileSize / 2)) < 1 && abs(py - (tileY + tileSize / 2)) < 1) {
            return true;
        }
    }
    return false;
}

let grassList = [];
let bestGrass = [];
let preyList = [];
let predatorList = [];
size = 25;
//grass
function makeField(rows, columns, size){
    for (let i = 0; i < rows; i++) {
        grassList[i] = [];
        for(let j = 0; j < columns; j++) {
            grassList[i][j] = new Grass(i * (size+2), j * (size+2), random(1,50), size);
            grassList[i][j].display();
        }
    }
}
function showField(){
    for (let i = 0; i < grassList.length; i++) {
        for(let j = 0; j < grassList[i].length; j++) {
            grassList[i][j].display();
        }
    }
}
function passiveGrow(){
    for (let i = 0; i < grassList.length-1; i++) {
        for(let j = 0; j < grassList[i].length-1; j++) {
            
            if (grassList[i][j].spread()) {
                grassList[i][j].grow(1.1);
                if (i + 1 < grassList.length) grassList[i + 1][j].grow(1.1); // down
                if (i - 1 >= 0) grassList[i - 1][j].grow(1.1);               // up
                if (j + 1 < grassList[i].length) grassList[i][j + 1].grow(1.1); // right
                if (j - 1 >= 0) grassList[i][j - 1].grow(1.1);               // left
            }
            else{
                grassList[i][j].grow();
            }

            grassList[i][j].display();
        }
    }
}
function findGrass(x, y, range=5) {
    let bestI = -1;
    let bestJ = -1;
    let maxVal = -Infinity;

    // Helper to check a tile and update max
    function checkTile(i, j) {
        if (i >= 0 && i < grassList.length && j >= 0 && j < grassList[i].length) {
            let val = grassList[i][j].getVal();
            if (val > maxVal) {
                maxVal = val;
                bestI = i;
                bestJ = j;
            }
        }
    }

    // First: search within range
    let startI = max(0, floor(x - range));
    let endI   = min(grassList.length - 1, floor(x + range));
    let startJ = max(0, floor(y - range));
    let endJ   = min(grassList[0].length - 1, floor(y + range));

    for (let i = startI; i <= endI; i++) {
        for (let j = startJ; j <= endJ; j++) {
            checkTile(i, j);
        }
    }

    // If no tile above 1 found, search the whole board
    if (maxVal <= 1) {
        maxVal = -Infinity; // reset
        bestI = -1;
        bestJ = -1;
        for (let i = 0; i < grassList.length; i++) {
            for (let j = 0; j < grassList[i].length; j++) {
                checkTile(i, j);
            }
        }
    }

    return [bestI, bestJ]; // array indices of the tile
}

//prey
function placePrey(i,j,prey){
    
    // Only place if tile is not occupied
    if (!isTileOccupied(i, j)) {
        let x = grassList[i][j].x + grassList[i][j].size / 2;
        let y = grassList[i][j].y + grassList[i][j].size / 2;
        prey.move(x, y);
    }
}
function showPrey(){
    for (let prey of preyList) {
        prey.display();
    }
}

//setup
function setup() {
    let container = document.getElementById('canvas-container');
    let canvas = createCanvas(container.clientWidth, container.clientHeight);
    canvas.parent('canvas-container');
    colorMode(HSB);
    // grass
    makeField(size, size, size);
    setInterval(passiveGrow, 1500);
    // prey    
    for (let i = 0; i < 5; i++) {
        let prey = new Prey();
        prey.age = 0; // Add age property
        preyList.push(prey);
        placePrey(floor(random(25)),floor(random(25)), preyList[i]);
    }
        // predators
        for (let i = 0; i < 2; i++) {
            let predator = new Predator(0, 0, 12.5);
            predator.age = 0; // Add age property
            predatorList.push(predator);
            // Place predator on a random tile not occupied by another predator
            let tries = 0;
            while (tries < 100) {
                let pi = floor(random(25));
                let pj = floor(random(25));
                if (!isTileOccupiedByPredator(pi, pj)) {
                    placePredator(pi, pj, predator);
                    break;
                }
                tries++;
            }
        }
    
}

let currentTime;
let lastTime = 0;  
let interval = 1520;  
function draw() {
    background(220);
    showField();
    showPrey();
    showPredators();
    
    
    // For each prey, use eat() to transfer energy from grass to prey if standing on a tile
    let elapsed = currentTime - lastTime;
    for (let prey of preyList) {
        let i = floor(prey.x / (size + 2));
        let j = floor(prey.y / (size + 2));
        if (
            i >= 0 && i < grassList.length &&
            j >= 0 && j < grassList[i].length
        ) {
            // Use eat function, passing only the current tile and proportional amount
            let eatAmount = elapsed * GRASS_DEPLETION_RATE;
            prey.eat([grassList[i][j]], eatAmount);
            // Clamp grass value to zero
            if (grassList[i][j].value < 0) grassList[i][j].value = 0;
        }
    }

    currentTime = millis(); // current time in ms
    fill(0);                // text color
    textSize(16);           // text size
    text("currentTime - lastTime: " + floor(currentTime-lastTime), 0, height-10); // position at (10, 20)
    text("elapsed time: " + floor(elapsed), 0, height-30);


    if (currentTime - lastTime > interval) {
        // Prey reproduction logic
        for (let prey of preyList) {
            if (prey.energy >= 150) {
                // Create new prey at same location with energy 25
                let baby = new Prey(prey.x, prey.y, prey.size);
                baby.energy = 25;
                baby.age = 0;
                preyList.push(baby);
                // Subtract 100 energy from parent
                prey.energy -= 100;
            }
        }

        // Predator movement, eating, and breeding
        for (let predator of predatorList) {
            get2Prey(predator.x, predator.y, predator);
        }
        // After all have moved, eat and breed
        for (let predator of predatorList) {
            // Eat prey on the same tile
            let i = floor(predator.x / (size + 2));
            let j = floor(predator.y / (size + 2));
            let preyOnTile = [];
            for (let k = preyList.length - 1; k >= 0; k--) {
                let prey = preyList[k];
                let pi = floor(prey.x / (size + 2));
                let pj = floor(prey.y / (size + 2));
                if (i === pi && j === pj) {
                    preyOnTile.push(prey);
                }
            }
            if (preyOnTile.length > 0) {
                predator.eat(preyOnTile);
                for (let eaten of preyOnTile) {
                    let idx = preyList.indexOf(eaten);
                    if (idx !== -1) preyList.splice(idx, 1);
                }
            }
        }
        // Breed after eating
        let newPredators = [];
        for (let predator of predatorList) {
            if (predator.energy > 250) {
                let baby = new Predator(predator.x, predator.y, 12.5);
                baby.energy = 100;
                baby.age = 0;
                newPredators.push(baby);
                predator.energy -= 150;
            }
        }
        predatorList.push(...newPredators);

        // Increment age and remove dead prey
        for (let i = preyList.length - 1; i >= 0; i--) {
            let prey = preyList[i];
            if (prey.age === undefined) prey.age = 0;
            prey.age++;
            if (prey.age >= 5) { // 10 intervals of 1500ms
                preyList.splice(i, 1);
            }
        }
        // Increment age and remove dead predators
        for (let i = predatorList.length - 1; i >= 0; i--) {
            let predator = predatorList[i];
            if (predator.age === undefined) predator.age = 0;
            predator.age++;
            if (predator.age >= 5) { // 20 intervals of 1500ms
                predatorList.splice(i, 1);
            }
        }

        all2Grass();
        lastTime = currentTime;      // run your function
    }

}
function onGrass(){

}
function all2Grass(){
    for (let prey of preyList) {
        get2Grass(prey.x, prey.y, prey);
    }
}
function get2Grass(x, y, prey) {
    // convert pixel coordinates to tile indices
    let i = floor(x / (size + 2));
    let j = floor(y / (size + 2));

    // now use tile indices for searching
    let tile = findGrass(i, j);

    // If tile is occupied, search for an unoccupied tile
    if (tile[0] !== -1 && tile[1] !== -1) {
        if (!isTileOccupied(tile[0], tile[1])) {
            placePrey(tile[0], tile[1], prey);
        } else {
            // Try to find another unoccupied tile with highest value
            let maxVal = -Infinity;
            let bestI = -1, bestJ = -1;
            for (let ii = 0; ii < grassList.length; ii++) {
                for (let jj = 0; jj < grassList[ii].length; jj++) {
                    if (!isTileOccupied(ii, jj)) {
                        let val = grassList[ii][jj].getVal();
                        // Predator movement and reproduction
                        for (let predator of predatorList) {
                            get2Prey(predator.x, predator.y, predator);
                            if (predator.energy > 250) {
                                let baby = new Predator(predator.x, predator.y, predator.size);
                                baby.energy = 100;
                                predatorList.push(baby);
                                predator.energy -= 150;
                            }
                        }
                        if (val > maxVal) {
                            maxVal = val;
                            bestI = ii;
                            bestJ = jj;
                        }
                    }
                }
            }
            if (bestI !== -1 && bestJ !== -1) {
                placePrey(bestI, bestJ, prey);
            }
        }
    }
}

function windowResized() {
    let container = document.getElementById('canvas-container');
    resizeCanvas(container.clientWidth, container.clientHeight);
}