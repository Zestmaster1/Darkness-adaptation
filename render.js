const antennaOffset = Math.PI / 15;
const eyeOffsetForward = 7;
const eyeOffsetSide = 7; 

function drawAll() {
  ctx.clearRect(0, 0, world.width, world.height);
  ctx.fillStyle
    = `rgb(${155 + (100 * lightLevel)}, ${175 + (80 * lightLevel)}, ${175 + (80 * lightLevel)})`;
  ctx.fillRect(0, 0, world.width, world.height);
  
  for (let ind of population) {
    // draw seeRange
    if (ind.eyes > 0) {
      ctx.fillStyle = `rgba(0, 0, 255, 0.033)`;
      ctx.beginPath();
      ctx.arc(ind.x, ind.y, ind.seeRange, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // draw smellRange
    ctx.fillStyle = `rgba(255, 0, 0, 0.033)`;
    ctx.beginPath();
    ctx.arc(ind.x, ind.y, ind.smellRange, 0, Math.PI * 2);
    ctx.fill();

    antennaSum += ind.antennae;
    eyeSum += ind.eyes;
    pigmentSum += ind.pigment;
  }
  
  ctx.strokeStyle = `rgba(255, 0, 255, 0.1)`;

  // draw egg-parent line
  for (let ind of allEggs) {
    for (let p of ind.parents) {
      ctx.beginPath();
      ctx.moveTo(ind.x, ind.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }
  
  ctx.strokeStyle = "black";
  
  for (let ind of allFood) draw(ind, 1.5);
  for (let ind of population) draw(ind, 12);
  
  ctx.fillStyle = "white";
  
  // draw eggs
  for (let ind of allEggs) {
    ctx.beginPath();
    ctx.arc(ind.x, ind.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

function draw(ind, r) {
  if (ind.angle !== undefined) {
    const lineLength = r + (ind.antennae * 10);

    // left antenna
    let leftX = ind.x + Math.cos(ind.angle - antennaOffset) * lineLength;
    let leftY = ind.y + Math.sin(ind.angle - antennaOffset) * lineLength;
    ctx.beginPath();
    ctx.moveTo(ind.x, ind.y);
    ctx.lineTo(leftX, leftY);
    ctx.stroke();

    // right antenna
    let rightX = ind.x + Math.cos(ind.angle + antennaOffset) * lineLength;
    let rightY = ind.y + Math.sin(ind.angle + antennaOffset) * lineLength;
    ctx.beginPath();
    ctx.moveTo(ind.x, ind.y);
    ctx.lineTo(rightX, rightY);
    ctx.stroke();
  }

  if (ind.pigment !== undefined) {
    let inverseP = 1 - ind.pigment;
    
    ctx.fillStyle = `rgb(${inverseP * 240}, ${inverseP * 200}, ${inverseP * 75})`;
  } else ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(ind.x, ind.y, r, 0, Math.PI * 2);
  ctx.fill();

  if (ind.eyes > 0) {
    const eyeRadius = 6 * ind.eyes;

    // compute vectors for forward and sideways directions
    const forwardX = Math.cos(ind.angle);
    const forwardY = Math.sin(ind.angle);
    const sideX = Math.cos(ind.angle + Math.PI / 2);
    const sideY = Math.sin(ind.angle + Math.PI / 2);

    // left eye position
    const leftEyeX = ind.x + forwardX * eyeOffsetForward + sideX * eyeOffsetSide;
    const leftEyeY = ind.y + forwardY * eyeOffsetForward + sideY * eyeOffsetSide;

    // right eye position
    const rightEyeX = ind.x + forwardX * eyeOffsetForward - sideX * eyeOffsetSide;
    const rightEyeY = ind.y + forwardY * eyeOffsetForward - sideY * eyeOffsetSide;

    ctx.fillStyle = "red";
    ctx.lineWidth = 2;
    
    // draw left eye
    ctx.beginPath();
    ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();

    // draw right eye
    ctx.beginPath();
    ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}
