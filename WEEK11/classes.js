class Grass {
    constructor(x, y, value=50, size=20) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.size = size;
        this.ripe = false;
        this.maxValue = 100;
    }

    display() {
        noStroke();
        fill(90, this.value, 90);
        rect(this.x, this.y, this.size, this.size);
    }

    grow(points = 1.25) {
        if(this.value <= this.maxValue-20)
            this.value *= points;
    }

    spread() {
        if (this.value >= this.maxValue) {
            return true;
        }
        else {
            return false;
        }   
    }

    getVal() {
        return this.value;
    }
}

class Prey {
    constructor(x=0, y=0, size=25) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.energy = 50;
        this.speed = 1;
    }

    display() {
        noStroke();
        fill(200, this.energy, 100);
        ellipse(this.x, this.y, this.size);
    }

    move(x,y) {
        this.x = x;
        this.y = y;
    }

    eat(grassList) {
        for (let i = grassList.length - 1; i >= 0; i--) {
            let d = dist(this.x, this.y, grassList[i].x, grassList[i].y);
            if (d < this.size / 2 + 5) {
                this.energy += grassList[i].value;
                grassList.splice(i, 1);
                this.size += 0.1;
                break;
            }
        }
    }

    breed() {
        if (this.energy > 150 && random() < 0.01) {
            this.energy -= 75;
            return new Prey(this.x + random(-10, 10), this.y + random(-10, 10));
        }
        return null;
    }

    isDead() {
        return this.energy <= 0 || this.age > 3000;
    }
}

class Predator {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 8;
        this.energy = 150;
        this.speed = 1.5;
    }

    display() {
        fill(255, 100, 100);
        ellipse(this.x, this.y, this.size);
    }

    move() {
        // No movement unless seeking
    }

    seek(target) {
        // Instantly move to target
        this.x = target.x;
        this.y = target.y;
        this.energy -= 0.4;
    }

    eat(preyList) {
        for (let i = preyList.length - 1; i >= 0; i--) {
            let d = dist(this.x, this.y, preyList[i].x, preyList[i].y);
            if (d < this.size / 2 + preyList[i].size / 2) {
                this.energy += 100;
                preyList.splice(i, 1);
                this.size += 0.2;
                break;
            }
        }
    }

    breed() {
        if (this.energy > 200 && random() < 0.005) {
            this.energy -= 100;
            return new Predator(this.x + random(-10, 10), this.y + random(-10, 10));
        }
        return null;
    }

    isDead() {
        return this.energy <= 0 || this.age > 4000;
    }
}