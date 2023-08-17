const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};

let enemiesPosition = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }

  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  elementsSize = Math.floor(canvasSize / 10 - 1);

  startGame();
}

function startGame() {
  // console.log({canvasSize, elementsSize});

  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[level];

  if (!map) {
    gameWon();
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
  }

  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));
  // console.log({map, mapRows, mapRowCols});

  showLives();

  enemiesPosition = [];  
  game.clearRect(0,0,canvasSize, canvasSize);

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = (elementsSize * (colI + 1)) + 20 ;
      const posY = elementsSize * (rowI + 1);

      if (col == 'O') { 
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          // console.log({playerPosition});
        }
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == 'X') {
        enemiesPosition.push({
          x: posX,
          y: posY,
        });
      }

      game.fillText(emoji, posX, posY);
    });
  });

  movePlayer();
}

function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;

  if (giftCollision) {
    levelWon();
  }

  const enemyCollision = enemiesPosition.find(enemy => {
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemyCollisionX && enemyCollisionY;
  });

  if (enemyCollision) {
    levelFailed();
  }

  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWon() {
  // console.log('Subiste de nivel!');
  level++;
  startGame();
}

function levelFailed() {
  // console.log('Chocaste contra un enemigo 😵!');
  lives--;
// console.log(lives);

  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWon() {
  console.log('¡Ganaste 🏆!');
  clearInterval(timeInterval);
}

function showLives() {
  const heartsArray = Array(lives).fill(emojis['HEART']);
  // console.log(heartsArray);

  spanLives.innerHTML = "";
  heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime(){
  spanTime.innerHTML = Date.now() - timeStart;
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
  if (event.key == 'ArrowUp') moveUp();
  else if (event.key == 'ArrowLeft') moveLeft();
  else if (event.key == 'ArrowRight') moveRight();
  else if (event.key == 'ArrowDown') moveDown();
}

function moveUp() {
  // console.log('Me quiero mover hacia arriba');

  if ((playerPosition.y - elementsSize) < elementsSize) {
    // console.log('Out 🚧!');
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}

function moveLeft() {
  // console.log('Me quiero mover hacia la izquierda');
  if ((playerPosition.x - elementsSize) < elementsSize) {
    // console.log('Out 🚧!');
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}

function moveRight() {
  // console.log('Me quiero mover hacia la derecha');
  if ((playerPosition.x + elementsSize) > (canvasSize + 10)) {
    // console.log('Out 🚧');
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}

function moveDown() {
  // console.log('Me quiero mover hacia abajo');
  if ((playerPosition.y + elementsSize) > canvasSize) {
    // console.log('Out 🚧');
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}
