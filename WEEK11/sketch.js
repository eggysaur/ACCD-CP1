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
function findGrass(x, y, range=10) {
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
        preyList.push(prey);
        placePrey(floor(random(25)),floor(random(25)), preyList[i]);
    }
    
}

let currentTime;
let lastTime = 0;  
let interval = 1520;  
function draw() {
    background(220);
    showField();
    showPrey();
    
    
    // For each prey, decrease grass value by adjustable rate per ms if standing on a tile
    let elapsed = currentTime - lastTime;
    for (let prey of preyList) {
        let i = floor(prey.x / (size + 2));
        let j = floor(prey.y / (size + 2));
        if (
            i >= 0 && i < grassList.length &&
            j >= 0 && j < grassList[i].length
        ) {
            grassList[i][j].value -= elapsed * GRASS_DEPLETION_RATE;
            // Clamp to zero
            if (grassList[i][j].value < 0) grassList[i][j].value = 0;
        }
    }

    currentTime = millis(); // current time in ms
    fill(0);                // text color
    textSize(16);           // text size
    text("currentTime - lastTime: " + floor(currentTime-lastTime), 0, height-10); // position at (10, 20)
    text("elapsed time: " + floor(elapsed), 0, height-30);


    if (currentTime - lastTime > interval) {
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