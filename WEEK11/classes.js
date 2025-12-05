class Grass {
    constructor(x, y, value=50, size=10) {
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
        this.energy = 15;
        this.color;
        this.speed = 1;
    }
    display() {
        noStroke();
        // Color reflects energy: hue=200, sat=map(energy,0,150,40,255), bright=100
       this.color = this.energy;
       if(this.energy < 150){
            fill(200, this.color, 100, this.color);
       }
       else if(this.energy > 150){
            fill(230, this.color, 100);
       }
       else if(this.energy < 0){
            fill(0,0,0);
       }    
        
        ellipse(this.x, this.y, this.size);
    }

    move(x,y) {
        this.x = x;
        this.y = y;
    }

    eat(grassList, amount=1) {
        for (let i = grassList.length - 1; i >= 0; i--) {
            let d = dist(this.x, this.y, grassList[i].x + grassList[i].size/2, grassList[i].y + grassList[i].size/2);
            if (d < this.size / 2 + grassList[i].size/2) {
                if (grassList[i].value > 0) {
                    let eatAmount = min(amount, grassList[i].value);
                    grassList[i].value -= eatAmount;
                    this.energy += eatAmount;
                    if (grassList[i].value < 0) grassList[i].value = 0;
                } else {
                    // If grass has no value, prey loses energy by the attempted amount
                    this.energy -= amount;
                }
                break;
            }
        }
    }
    breed(){
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
    constructor(x=0, y=0, size=12.5) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.energy = 40;
        this.speed = 1.5;
    }

    display() {
        noStroke();
        // Color reflects energy: hue=10, sat=map(energy,0,250,40,255), bright=100
        let sat = constrain(map(this.energy, 0, 250, 40, 255), 40, 255);
        fill(10, sat, 100);
        ellipse(this.x, this.y, this.size);
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }

    eat(preyList) {
        // preyList is an array of prey on this tile (should be length 1)
        for (let i = preyList.length - 1; i >= 0; i--) {
            let prey = preyList[i];
            let d = dist(this.x, this.y, prey.x, prey.y);
            if (d < this.size / 2 + prey.size / 2) {
                let gain = min(prey.energy, 100);
                this.energy += gain;
                preyList.splice(i, 1);
                break;
            }
        }
    }

    breed() {
        if (this.energy > 350) {
            this.energy -= 250;
            return new Predator(this.x + random(-10, 10), this.y + random(-10, 10), this.size);
        }
        return null;
    }

    isDead() {
        return this.energy <= 0;
    }
}