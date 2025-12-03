class Grass {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.value = 100;
        this.maxValue = 100;
    }

    display() {
        stroke();
        fill(100, 200, 100);
        rect(this.x, this.y, 5, 5);
    }

    grow() {
        this.value = min(this.value + 0.5, this.maxValue);
    }

    spread() {
        if (random() < 0.01 && this.value > 50) {
            return new Grass(this.x + random(-20, 20), this.y + random(-20, 20));
        }
        return null;
    }

    isDead() {
        return this.value <= 0;
    }
}

class Prey {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.energy = 100;
        this.speed = 1;
    }

    display() {
        fill(0, 150, 255);
        ellipse(this.x, this.y, this.size);
    }

    move() {
        // No movement unless seeking
    }

    seek(target) {
        // Instantly move to target
        this.x = target.x;
        this.y = target.y;
        this.energy -= 0.2;
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