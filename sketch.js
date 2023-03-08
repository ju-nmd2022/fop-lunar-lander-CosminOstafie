//This was used to understand the switch statement
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch

// Game state constants
const STATE_START = 0;
const STATE_PLAYING = 1;
const STATE_GAME_OVER = 2;

let gameState; //Variable used to switch and compare the states of the game.

// Background stars variables
let starX = [];
let starY = [];
let starAlpha = [];

// Rocket properties
let rocketX, rocketY;
let rocketSize;
let rocketSpeedX, rocketSpeedY;
let rocketAccelerationX, rocketAccelerationY;
let gravity;
let maxSpeedY;

// Landing pad properties
let padX, padY, padWidth, padHeight;

// Variables for fuel
let fuel;
let fuelMax;
let fuelConsumption;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style("display", "block");
  textAlign(CENTER);
  frameRate(30);

  //Background stars

  for (let i = 0; i < 300; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const alpha = Math.random();

    starX.push(x);
    starY.push(y);
    starAlpha.push(alpha);
  }

  //This was used to understand gravity and acceleration
  //https://editor.p5js.org/hosken/sketches/-mKtTzLUU

  // Initialize game state and rocket properties
  gameState = STATE_START;
  rocketX = width / 2;
  rocketY = 50;
  rocketSize = 95;
  rocketSpeedX = 0;
  rocketSpeedY = 0;
  rocketAccelerationX = 0;
  rocketAccelerationY = 0;
  gravity = 0.05;
  maxSpeedY = 10;

  // Initialize landing pad
  padX = width / 2 - 50;
  padY = height - 50;
  padWidth = 100;
  padHeight = 10;

  // Initialize fuel variables
  fuel = fuelMax = 300;
  fuelConsumption = 1;
}

function draw() {
  background(220);

  switch (gameState) {
    case STATE_START:
      // Display start screen
      textSize(32);
      fill(0);
      text("Press SPACE to start", width / 2, height / 2);
      text("Use the arrows to control the ship", width / 2, height / 2 + 40);
      break;

    case STATE_PLAYING:
      // Apply acceleration to the rocket
      if (keyIsDown(UP_ARROW) && fuel > 0) {
        rocketAccelerationY = -0.1;
        fuel -= fuelConsumption;
      } else {
        rocketAccelerationY = 0;
      }
      if (keyIsDown(LEFT_ARROW)) {
        rocketAccelerationX = -0.1;
      } else if (keyIsDown(RIGHT_ARROW)) {
        rocketAccelerationX = 0.1;
      } else {
        rocketAccelerationX = 0;
      }
      rocketSpeedX += rocketAccelerationX;
      rocketSpeedY += rocketAccelerationY;

      // Update rocket position based on speed and gravity
      rocketSpeedY += gravity;
      rocketSpeedY = min(rocketSpeedY, maxSpeedY); // Limit maximum falling speed
      rocketX += rocketSpeedX;
      rocketY += rocketSpeedY;

      //Draw night sky - Credits https://www.youtube.com/watch?v=kISBKRn-6_I&t=295s&ab_channel=Garrit
      push();
      noStroke();
      background(0);
      for (let index in starX) {
        fill(255, 255, 255, Math.abs(Math.sin(starAlpha[index])) * 255);
        ellipse(starX[index], starY[index], 3);
        starAlpha[index] += 0.02;
      }
      pop();

      // Draw the rocket
      //Rocket Body
      fill(253, 218, 13);
      ellipse(rocketX, rocketY, 30, 70);
      //Rocket Head
      beginShape();
      curveVertex(rocketX - 10, rocketY - 25);
      curveVertex(rocketX + 10, rocketY - 25);
      endShape(CLOSE);
      //Rocket Bottom
      fill(153, 25, 33);
      quad(
        rocketX - 10,
        rocketY + 28,
        rocketX - 10,
        rocketY + 35,
        rocketX + 10,
        rocketY + 35,
        rocketX + 10,
        rocketY + 28
      );
      //Rocket Window
      fill(203, 253, 255);
      ellipse(rocketX, rocketY - 5, 15);
      //Rocket Front Leg
      fill(203, 25, 33);
      ellipse(rocketX, rocketY + 30, 10, 35);
      //Rocket Left Leg
      fill(203, 25, 33);
      quad(
        rocketX - 13,
        rocketY + 15,
        rocketX - 25,
        rocketY + 20,
        rocketX - 25,
        rocketY + 30,
        rocketX - 13,
        rocketY + 20
      );
      arc(rocketX - 25, rocketY + 30, 10, 35, HALF_PI, (3 * PI) / 2, CHORD);
      //Rocket Right Leg
      quad(
        rocketX + 13,
        rocketY + 15,
        rocketX + 25,
        rocketY + 20,
        rocketX + 25,
        rocketY + 30,
        rocketX + 13,
        rocketY + 20
      );
      arc(rocketX + 25, rocketY + 30, 10, 35, (3 * PI) / 2, HALF_PI, CHORD);

      // Draw the landing pad
      fill(220);
      rect(padX, padY, padWidth, padHeight, 5);
      fill(255, 0, 0);
      noStroke();
      //Draw the lights of the landing pad. I used multiples of 7 for the X position of the lights.
      ellipse(padX + 7, padY + 5, 6);
      ellipse(padX + 21, padY + 5, 6);
      ellipse(padX + 35, padY + 5, 6);
      ellipse(padX + 49, padY + 5, 6);
      ellipse(padX + 63, padY + 5, 6);
      ellipse(padX + 77, padY + 5, 6);
      ellipse(padX + 91, padY + 5, 6);

      //Write the fuel amount in units
      textAlign(LEFT, TOP);
      textSize(14);
      stroke(0);
      fill(255);
      text("Fuel: " + fuel + " units", 20, 20);

      //Write the speed in px/s
      textAlign(RIGHT, CENTER);
      textSize(14);
      stroke(0);
      fill(255);
      text(
        "Vertical Speed: " + round(rocketSpeedY * 5) + " m/s",
        width - 50,
        30
      );

      // Check if rocket hits the landing pad
      if (
        rocketY + rocketSize / 2 >= padY &&
        rocketY + rocketSize / 2 <= padY + padHeight &&
        rocketX >= padX &&
        rocketX <= padX + padWidth
      ) {
        // Rocket has landed on the pad
        if (rocketSpeedY <= 5) {
          // Successful landing
          textSize(32);
          textAlign(CENTER, CENTER);
          fill(0, 255, 0);
          text("SUCCESSFUL LANDING", width / 2, height / 2);

          // Stop the rocket from moving
          rocketSpeedX = 0;
          rocketSpeedY = 0;
          rocketAccelerationX = 0;
          rocketAccelerationY = 0;

          // Update game state
          // We will use noLoop() to stop draw() function
          gameState = STATE_GAME_OVER;
          noLoop();
        } else {
          // Failed landing
          textSize(32);
          textAlign(CENTER, CENTER);
          fill(255, 0, 0);
          text("FAIL! You Crashed", width / 2, height / 2);

          // Update game state
          gameState = STATE_GAME_OVER;
          noLoop();
        }
      }

      // https://www.youtube.com/watch?v=LO3Awjn_gyU&ab_channel=TheCodingTrain
      // This was used to understand how to limit the bounds.
      // Check if rocket goes out of bounds
      if (
        rocketX + rocketSize / 2 < 0 ||
        rocketX - rocketSize / 2 > width ||
        rocketY - rocketSize / 2 > height
      ) {
        // Rocket went out of bounds
        textSize(32);
        textAlign(CENTER, CENTER);
        fill(255, 0, 0);
        text("OUT OF BOUNDS", width / 2, height / 2);

        // Update game state
        gameState = STATE_GAME_OVER;
        noLoop();
      }

      // Out of fuel case
      if (fuel <= 0) {
        textSize(32);
        textAlign(CENTER, CENTER);
        fill(255, 0, 0);
        text("OUT OF FUEL", width / 2, height / 2);

        // Update game state
        gameState = STATE_GAME_OVER;
        noLoop();
      }

      if (gameState === STATE_GAME_OVER) {
        // Display game over screen
        textSize(24);
        fill(255);
        text("Press ENTER to restart", width / 2, height / 2 + 50);
      }
  }
}

function keyPressed() {
  if (gameState === STATE_START && key === " ") {
    // Start the game
    gameState = STATE_PLAYING;
  } else if (gameState === STATE_GAME_OVER && keyCode === ENTER) {
    // Restart the game
    resetGame();
  }
}

function resetGame() {
  // Reset Rocket variables
  rocketX = width / 2;
  rocketY = 50;
  rocketSpeedX = 0;
  rocketSpeedY = 0;
  rocketAccelerationX = 0;
  rocketAccelerationY = 0;

  // Reset fuel
  fuel = fuelMax;

  // Reset game state
  //We use loop() to make the draw() function loop again after restart
  gameState = STATE_START;
  loop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
