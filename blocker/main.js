title = "BLOCKER";

description = `
[CLICK] 
Change Directions
`;

characters = [
`
P   P
P   P
P   P
P   P
 PPP
`,`
 PPPPP
PPPpppPPP
PPPpppPPP
PPPpppPPP
 PPPPP
`,
];

const G = {
  
	WIDTH: 150,
	HEIGHT: 100,

  ENEMY_MIN_BASE_SPEED: 0.5,
  ENEMY_MAX_BASE_SPEED: 1.2,
};


options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isPlayingBgm: true,
  isReplayEnabled: true,

  theme: "pixel"
};

let x;
let w;
let frogs;
let l;

/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

/**
 * @typedef {{
 * pos: Vector,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @type { number }
 */
let currentEnemySpeed;

 /**
  * @type { number }
  */
let waveCount;

 /**
  * @type { number }
  */
let collideCount = 0;


function update() {
  if (!ticks) {
    frogs = times(4, (i) => {
      return { p: vec(0, -i * 9), a: rnd(9) };
    });
    x = 50;
    w = 1;

    const posX = rnd(20, 130);
    const posY = rnd(0, G.HEIGHT);

    enemies = [];
    waveCount = 0;
    
  }

  // Spawning enemies
  if (enemies.length === 0) {
    currentEnemySpeed =
        rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
    for (let i = 0; i < 2; i++) {
        const posX = rnd(20, 130);
        const posY = -rnd(i * G.HEIGHT * 0.1);
        enemies.push({
            pos: vec(posX, posY),
            firingCooldown: G.ENEMY_FIRE_RATE 
        });
    }

    waveCount++; // Increase the tracking variable by one
    // console.log("YUP")
    // console.log("Collide Count after wave: ", collideCount)
    if (collideCount == 0) {
      if (waveCount > 1) {
        play("hit");
        end();
      }
    }
    else {
      play("coin");
    }
    collideCount = 0
  }

  remove(enemies, (e) => {
    e.pos.y += currentEnemySpeed;
    color("purple");
    // char("b", e.pos);

    const isCollidingWithPlayer = char("b", e.pos).isColliding.rect.purple;
    if (isCollidingWithPlayer) {
        end();
        play("powerUp");
    }

    return (e.pos.y > G.HEIGHT);
  });

  
  // Spawning player
  player = {
    pos: vec(x, 80)
  };

  color("light_black");
  char("a", player.pos);


  // Player collision with item
  if (char("a", player.pos).isColliding.char.b) {
    // console.log("COLLIDING")
    collideCount += 1
  }

  // Score increasing
  score++;

  // Player increasing speed
  x += w * difficulty;
  
  // User input to change directions
  if (input.isJustPressed || x < 20 || x > 130) {
    w *= -1;
  }

  // Map borders
  color("purple");
  rect(0, 0, 20, 200);

  color("purple");
  rect(130, 0, 150, 200);

  color("purple");
  rect(0, 83, 200, 30);
}

