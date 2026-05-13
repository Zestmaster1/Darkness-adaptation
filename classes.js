class Cell {
  constructor(x, y, antennaeAlleles, eyeAlleles, pigmentAlleles) {
    this.x = x ?? Math.random() * world.width;
    this.y = y ?? Math.random() * world.height;
    this.angle = Math.random() * Math.PI * 2;
    this.target = null;
    this.energy = 5000;
    
    this.antennae = 0;
    this.eyes = 0;
    this.pigment = 0;
    
    this.antennaeAlleles = antennaeAlleles ?? [{ v: 1, dom: 0 }, { v: 1, dom: 0 }];
    this.eyeAlleles = eyeAlleles ?? [{ v: 1, dom: 0 }, { v: 1, dom: 0 }];
    this.pigmentAlleles = pigmentAlleles ?? [{ v: 1, dom: 0 }, { v: 1, dom: 0 }];
    
    this.seeRange = 0;
    this.smellRange = 0;
    this.senseRange = 0;
    
    this.pigmentFactor = 0;
    
    this.randDirection = 0.01;

    this.initialize();
  }
  
  // calculate sense ranges and phenotype from allele dominance
  initialize() {
    let antA1 = this.antennaeAlleles[0];
    let antA2 = this.antennaeAlleles[1];
    antA1.dom > antA2.dom ? this.antennae = antA1.v : this.antennae = antA2.v;

    let eyeA1 = this.eyeAlleles[0];
    let eyeA2 = this.eyeAlleles[1];
    eyeA1.dom > eyeA2.dom ? this.eyes = eyeA1.v : this.eyes = eyeA2.v;
    
    let pigA1 = this.pigmentAlleles[0];
    let pigA2 = this.pigmentAlleles[1];
    pigA1.dom > pigA2.dom ? this.pigment = pigA1.v : this.pigment = pigA2.v;
    
    this.seeRange = lightLevel * this.eyes * 200;
    this.smellRange = this.antennae * 50;
    
    this.senseRange = Math.max(this.seeRange, this.smellRange);
    
    this.pigmentFactor = (Math.abs(lightLevel - this.pigment) / 5) + (this.pigment / 75);
  }
  
  update() {
    let antennaFactor = (this.antennae - 1) / 15;
    let eyeFactor = this.eyes / 5;
    
    this.energy -= 0.5 + antennaFactor + eyeFactor + this.pigmentFactor;
    
    let minDist = this.senseRange ** 2;
    let nearest;
    
    // find food target
    for (let ind of allFood) {
      let dx = ind.x - this.x;
      let dy = ind.y - this.y;
      let distSq = dx * dx + dy * dy;

      if (distSq < 15 ** 2) {
        allFood.splice(allFood.indexOf(ind), 1);
        this.target = null;
        this.energy = Math.min(15000, this.energy + 750);
      }
      
      if (distSq < minDist) {
        minDist = distSq;
        nearest = ind;
      }
    }
    
    this.target = nearest;
    
    let speed = 0.5 + (lightLevel * this.eyes / 10);
    
    // steer towards target
    if (this.target) {
      let dx = this.target.x - this.x;
      let dy = this.target.y - this.y;
      let distSq = dx * dx + dy * dy;
      
      let targetAngle = Math.atan2(dy, dx);
      let diff = targetAngle - this.angle;
      
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      
      let turnRate = 0;
      
      if (distSq < this.smellRange ** 2) {
        turnRate = 0.02;
      }
      if (distSq < this.seeRange ** 2) {
        turnRate = 0.04;
        speed += 0.2;
      }
      
      this.angle += diff * turnRate;
      
      // Random steering when target is absent
    } else {
      if (Math.random() < 0.01) this.randDirection *= -1;
      this.angle += this.randDirection;
    }
    
    for (let ind of population) {
      if (ind !== this) {
        let dx = ind.x - this.x;
        let dy = ind.y - this.y;
        let distSq = dx * dx + dy * dy;
        
        if (distSq < this.senseRange ** 2 && distSq < ind.senseRange ** 2) {
          if (this.energy > 10000 && ind.energy > 10000) {
            this.reproduce(ind);
          }
        }

        if (distSq < 25 ** 2) {
          this.x -= dx / distSq * 5;
          this.y -= dy / distSq * 5;
        }
      }
    }
    
    this.x += Math.cos(this.angle) * speed;
    this.y += Math.sin(this.angle) * speed;
    
    this.bounds();
  }
  
  // nudge cell to be within the canvas
  bounds() {
    if (this.x < worldMargin) {
      let strength = (worldMargin - this.x) / worldMargin * 0.5;
      this.x += strength;
    }
    if (this.x > world.width - worldMargin) {
      let strength = (this.x - (world.width - worldMargin)) / worldMargin * 0.5;
      this.x -= strength;
    }
    if (this.y < worldMargin) {
      let strength = (worldMargin - this.y) / worldMargin * 0.5;
      this.y += strength;
    }
    if (this.y > world.height - worldMargin) {
      let strength = (this.y - (world.height - worldMargin)) / worldMargin * 0.5;
      this.y -= strength;
    }
  }
  
  mutate() {
    let channel = Math.ceil(Math.random() * 3);
    let index = Math.floor(Math.random() * 2);
    let change = Math.random() - 0.75;
    
    switch(channel) {
      // antenna
      case 1:
        this.antennaeAlleles[index].v
          = Math.min(3, Math.max(1, this.antennaeAlleles[index].v + change));
        this.antennaeAlleles[index].dom += change;
        break;

      // eye
      case 2:
        this.eyeAlleles[index].v
          = Math.min(1, Math.max(0, this.eyeAlleles[index].v + change));
        this.eyeAlleles[index].dom += change;

        break;
        
      // pigment
      case 3:
        this.pigmentAlleles[index].v
          = Math.min(1, Math.max(0, this.pigmentAlleles[index].v + change));
        this.pigmentAlleles[index].dom += change;
        break;
    }
  }
  
  reproduce(other) {
    for (let i = 0; i < 2; i++) {
      let childX = (this.x + other.x) / 2 + ((Math.random() - 0.5) * 25);
      let childY = (this.y + other.y) / 2 + ((Math.random() - 0.5) * 25);
      
      let childAA1 = this.antennaeAlleles[Math.floor(Math.random() * 2)];
      let childAA2 = other.antennaeAlleles[Math.floor(Math.random() * 2)];
      
      let childEA1 = this.eyeAlleles[Math.floor(Math.random() * 2)];
      let childEA2 = other.eyeAlleles[Math.floor(Math.random() * 2)];
      
      let childPA1 = this.pigmentAlleles[Math.floor(Math.random() * 2)];
      let childPA2 = other.pigmentAlleles[Math.floor(Math.random() * 2)];
      
      let childAntennaeAlleles = JSON.parse(JSON.stringify([childAA1, childAA2]));
      let childEyeAlleles = JSON.parse(JSON.stringify([childEA1, childEA2]));
      let childPigmentAlleles = JSON.parse(JSON.stringify([childPA1, childPA2]));
      
      let child = new Cell(childX, childY, childAntennaeAlleles, childEyeAlleles, childPigmentAlleles);
      allEggs.push(new Egg(child, [this, other]));
    }

    this.energy -= 1000;
    other.energy -= 1000;
  }
}

class Egg {
  constructor(ind, parents) {
    this.ind = ind;
    
    this.x = this.ind.x;
    this.y = this.ind.y;
    this.age = 0;
    this.hatched = false;
    this.parents = parents;
  }
  
  update() {
    this.age++;
    
    if (this.age > 5000) {
      this.hatched = true;
      
      if (Math.random() < 0.5) this.ind.mutate();
      this.ind.initialize();
      population.push(this.ind);
    }
  }
}

class Food {
  constructor() {
    this.x = Math.random() * world.width;
    this.y = Math.random() * world.height;
    this.age = 0;
  }
}
