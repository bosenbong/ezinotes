// 🎮 MEME RAGE GAME - "RAGE BAIT"
// A game that hates you

let playerX = 50;
let playerY = 300;
let playerSize = 25;
let velocityY = 0;
let gravity = 0.6;
let jumpPower = -12;
let onGround = false;

let platforms = [];
let traps = [];
let trolls = [];
let message = "";
let messageTimer = 0;
let gameOver = false;
let level = 1;
let deaths = 0;
let rageLevel = 0;

// Meme messages
const messages = [
  "nice try lol",
  "L + ratio + skill issue",
  "git gud",
  "💀 skill issue 💀",
  "you fell for the bait",
  "EZ",
  "imposter syndrome",
  "NPC moment",
  "cringe",
  "NOT LIKE THIS"
];

// Fake safe platforms (traps!)
const trapPlatforms = [];

function setup() {
  createCanvas(600, 400);
  resetLevel();
}

function resetLevel() {
  playerX = 50;
  playerY = 300;
  velocityY = 0;
  gameOver = false;
  
  // Create platforms
  platforms = [
    {x: 0, y: 350, w: 200, h: 50, safe: true},
    {x: 250, y: 320, w: 80, h: 20, safe: true},
    {x: 380, y: 280, w: 80, h: 20, safe: false}, // FAKE!
    {x: 500, y: 250, w: 100, h: 20, safe: true},
    
    // Upper platforms
    {x: 100, y: 220, w: 60, h: 15, safe: true},
    {x: 200, y: 180, w: 60, h: 15, safe: false}, // FAKE!
    {x: 300, y: 150, w: 60, h: 15, safe: true},
    {x: 400, y: 120, w: 80, h: 15, safe: false}, // FAKE!
    
    // Goal
    {x: 520, y: 80, w: 60, h: 15, safe: true, goal: true}
  ];
  
  // Add some trolls at random times
  trolls = [
    {x: 350, y: 250, trigger: 'approach', action: 'move'},
    {x: 180, y: 160, trigger: 'jump', action: 'delete'}
  ];
}

function draw() {
  background(30, 30, 40);
  
  // Draw rage level
  fill(255, 100, 100);
  textSize(12);
  text("RAGE: " + "🔥".repeat(min(rageLevel, 10)), 10, 20);
  text("Deaths: " + deaths, 10, 35);
  
  // Level
  text("Level " + level, width - 80, 20);
  
  if (gameOver) {
    fill(255, 50, 50);
    textSize(40);
    textAlign(CENTER);
    text("GAME OVER", width/2, height/2 - 20);
    textSize(20);
    text(random(messages), width/2, height/2 + 30);
    textSize(16);
    text("Click to rage again", width/2, height/2 + 70);
    return;
  }
  
  // Update message
  if (messageTimer > 0) {
    messageTimer--;
    fill(255, 200, 0);
    textSize(24);
    textAlign(CENTER);
    text(message, width/2, 50);
  }
  
  // Player physics
  velocityY += gravity;
  playerY += velocityY;
  
  // Platform collision
  onGround = false;
  for (let p of platforms) {
    if (playerX + playerSize/2 > p.x && 
        playerX + playerSize/2 < p.x + p.w &&
        playerY + playerSize > p.y &&
        playerY + playerSize < p.y + p.h + 10 &&
        velocityY >= 0) {
      
      if (!p.safe) {
        // FAKE PLATFORM! Falls through!
        showMessage("💀 TRAP! 💀");
        playerY = p.y + playerSize;
      } else if (p.goal) {
        // WIN!
        levelComplete();
      } else {
        playerY = p.y - playerSize;
        velocityY = 0;
        onGround = true;
      }
    }
  }
  
  // Draw platforms
  for (let p of platforms) {
    if (p.safe || p.goal) {
      fill(100, 255, 150); // Green = safe
      if (p.goal) fill(255, 215, 0); // Gold = win
    } else {
      fill(100, 255, 150); // LOOKS safe!
    }
    rect(p.x, p.y, p.w, p.h, 5);
  }
  
  // Draw player
  fill(255, 100, 150);
  ellipse(playerX, playerY, playerSize);
  // Eyes
  fill(255);
  ellipse(playerX - 5, playerY - 3, 8);
  ellipse(playerX + 5, playerY - 3, 8);
  fill(0);
  ellipse(playerX - 5, playerY - 3, 3);
  ellipse(playerX + 5, playerY - 3, 3);
  
  // Fall death
  if (playerY > height + 50) {
    die();
  }
  
  // Controls
  if (keyIsDown(LEFT_ARROW)) playerX -= 4;
  if (keyIsDown(RIGHT_ARROW)) playerX += 4;
  
  playerX = constrain(playerX, 0, width - playerSize);
}

function keyPressed() {
  if (key === ' ' || keyCode === UP_ARROW) {
    if (onGround) {
      velocityY = jumpPower;
      showMessage(random(["NOPE", "LMAO", "try again"]));
    }
  }
  
  if (gameOver && key === ' ') {
    resetLevel();
  }
}

function mousePressed() {
  if (gameOver) {
    resetLevel();
  }
}

function die() {
  deaths++;
  rageLevel++;
  showMessage(random(messages));
  playerX = 50;
  playerY = 300;
  velocityY = 0;
}

function levelComplete() {
  showMessage("LUCKY!");
  level++;
  delay(1000);
  resetLevel();
}

function showMessage(msg) {
  message = msg;
  messageTimer = 90;
}

function delay(ms) {
  let start = millis();
  while (millis() - start < ms) {}
}