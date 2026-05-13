const world = document.getElementById("world");
const ctx = world.getContext("2d");
world.width = 2500;
world.height = 1500;

let population = [], allEggs = [], allFood = [];
let simSpeed = 1, lightLevel = 1;
let worldMargin = 15;

let avgAntennaCounter = document.getElementById("avgAntenna");
let avgEyeCounter = document.getElementById("avgEye");
let avgPingentCounter = document.getElementById("avgPigment");
let populationCounter = document.getElementById("population");

let antennaSum = 0, eyeSum = 0, pigmentSum = 0;

function start() {
  for (let i = 0; i < 10; i++) population.push(new Cell());
  // population.push(new Cell(null, null, [{ v: 3, dom: 1 }, { v: 3, dom: 1 }], [{ v: 0, dom: -1 }, { v: 0, dom: -1 }], [{ v: 0, dom: -1 }, { v: 0, dom: -1 }]));
  // population.push(new Cell(null, null, undefined, undefined, [{ v: 0.5, dom: -2 }, { v: 0.5, dom: -2 }]));
  
  step();
}

function step() {
  setTimeout(() => step(), 1);

  antennaSum = 0;
  eyeSum = 0;
  pigmentSum = 0;
  
  // functional step
  for (let i = 0; i < simSpeed; i++) {
    for (let ind of population) ind.update();
    for (let ind of allEggs) ind.update();
    for (let ind of allFood) ind.age++;
    
    allFood = allFood.filter(ind => ind.age < 5000);
    population = population.filter(ind => ind.energy > 0);
    allEggs = allEggs.filter(ind => !ind.hatched);
    
    if (Math.random() < 0.075) allFood.push(new Food());
  }

  drawAll();

  // update stat table
  populationCounter.textContent = population.length;
  avgAntennaCounter.textContent = (antennaSum / population.length).toFixed(2);
  avgEyeCounter.textContent = (eyeSum / population.length).toFixed(2);
  avgPingentCounter.textContent = (pigmentSum / population.length).toFixed(2);
}

// sliders
function parameters() {
  simSpeed = Number(document.getElementById("simSpeed").value);
  lightLevel = Number(document.getElementById("lightLevel").value);
  
  for (let ind of population) ind.initialize();
}

start();
