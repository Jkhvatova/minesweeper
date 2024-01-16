import '../scss/main.scss';

window.addEventListener('DOMContentLoaded', () => {
  // init
  const body = document.querySelector('body');
  const header = document.createElement('header');
  body.appendChild(header);
  header.innerHTML =
    '<div class="container"><h1>Run Away From a Fox</h1></div>';
  const menu = document.createElement('div');
  menu.className = 'menu';
  menu.innerHTML = ` <div class="container">
  <div class="settings">
  <div class="difficulty">
    <div class="dropdown">
      <select name="difficulty" id="difficulty" class="dropbtn">
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>
    </div>
  </div>
  <div class="mines">
    <input type="range" min="10" max="99" step="1" value="10">
    <div class="value">10</div>
  </div>
  <div class="start"><button class="start-btn">Start game</button></div>
  <button class="sound"></button>
</div>
<div class="gamestats">
  <div class="timer-title">time:</div>
  <div class="timer">00:00</div>
  <div class="clicks-title">clicks:</div>
  <div class="clicks">0</div>
  <div class="flags-title">flags:</div>
  <div class="flags">0</div>
</div> </div> `;
  body.appendChild(menu);
  const main = document.createElement('div');
  main.className = 'main';
  body.appendChild(main);
  main.innerHTML = '<canvas id="canvas" width=" 480" height="480"></canvas>';
  const highscore = document.createElement('div');
  highscore.className = 'highscore';
  body.appendChild(highscore);
  highscore.innerHTML = `
  <div class="container">
    <h2>highscore</h2>
  </div>`;
  // canvas init
  const canvas = document.getElementById('canvas');
  canvas.innerText = 'Your browser does not support canvas';
  canvas.style.border = 'none';
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#222';

  // game settings
  const gameSettings = {
    easy: {
      difficulty: 'easy',
      bombs: 10,
      rows: 10,
      columns: 10,
    },
    medium: {
      difficulty: 'medium',
      bombs: 10,
      rows: 15,
      columns: 15,
    },
    hard: {
      difficulty: 'hard',
      bombs: 10,
      rows: 25,
      columns: 25,
    },
  };
  // game sound
  const soundBtn = document.querySelector('.sound');
  const soundOn = 'on';
  soundBtn.addEventListener('click', () => {
    if (soundBtn.classList.contains(soundOn)) {
      soundBtn.classList.remove(soundOn);
    } else {
      soundBtn.classList.add(soundOn);
    }
  });

  function playSound(type) {
    if (soundBtn.classList.contains(soundOn)) {
      const audio = new Audio(`./assets/${type}.wav`);
      audio.play();
    }
  }

  // takes bombs from input
  const bombsInput = document.querySelector('input[type=range]');
  let currentBombsInput = gameSettings.easy.bombs;
  function getInput() {
    currentBombsInput = bombsInput.value;
    const bombsMenuCount = document.querySelector('.value');
    bombsMenuCount.innerHTML = currentBombsInput;
  }
  // takes difficulty
  const difficultyOptions = document.getElementById('difficulty');
  let currDifficulty = gameSettings.easy.difficulty;
  difficultyOptions.addEventListener('change', (e) => {
    const { value } = e.target[e.target.options.selectedIndex];
    currDifficulty = value;
    return currDifficulty;
  });
  bombsInput.addEventListener('input', getInput);
  // show clicks count
  let clicksCount = 0;
  const menuClickCount = document.querySelector('.clicks');

  // constants and variables
  const bombs = currentBombsInput;
  let { columns } = gameSettings.easy;
  let rows = gameSettings.easy.columns;
  // show flags
  let flagsCount = bombs;
  let bombsFound = 0;
  let openCells = 0;
  const menuFlagsCount = document.querySelector('.flags');
  menuFlagsCount.innerHTML = flagsCount;
  // set timer on game start
  const menuTimer = document.querySelector('.timer');
  let totalTime = 0;
  let startTimer;
  // show time in min: sec
  function initTimer() {
    totalTime += 1;
    const min = Math.floor(totalTime / 60)
      .toString()
      .padStart(2, '0');
    const sec = Math.floor(totalTime % 60)
      .toString()
      .padStart(2, '0');
    menuTimer.innerHTML = `${min}:${sec}`;
  }

  // calculate cellsize, then generate 2d array with given cols, rows
  let cellSize = Math.floor(parseInt(canvas.width, 10) / columns);
  function generateInitMatrix(cols, rows) {
    const matrix = new Array(cols);
    for (let i = 0; i < matrix.length; i += 1) {
      matrix[i] = new Array(rows);
    }
    return matrix;
  }
  let gameField = generateInitMatrix(columns, rows);
  // cell class
  class Cell {
    constructor(size, i, j) {
      this.size = size;
      this.i = i;
      this.j = j;
      this.coordX = i * size;
      this.coordY = j * size;
      this.isShown = false;
      this.isBomb = false;
      this.isFlagged = false;
      this.nearestBombsCount = 0;
    }

    createCell() {
      ctx.fillRect(
        this.coordX + 1,
        this.coordY + 1,
        this.size - 2,
        this.size - 2,
      );
      ctx.strokeRect(this.coordX, this.coordY, this.size, this.size);
      ctx.strokeStyle = '#2E86C1';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    countNeigbourBombs() {
      let result = 0;
      if (this.isBomb) {
        this.nearestBombsCount = -1;
        return;
      }
      for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          const indexX = this.i + offsetX;
          const indexY = this.j + offsetY;
          if (indexX > -1 && indexX < columns && indexY > -1 && indexY < rows) {
            const neighbourCell = gameField[indexX][indexY];
            if (neighbourCell.isBomb) {
              result += 1;
            }
          }
        }
      }
      this.nearestBombsCount = result;
    }

    render() {
      ctx.fillStyle = 'lightblue';
      this.createCell();
      if (this.isShown) {
        if (this.isBomb) {
          ctx.fillStyle = '#F5B7B1';
          this.createCell();
          const bombImg = new Image();
          bombImg.src = './assets/fox.png';
          bombImg.onload = () => {
            if (columns === 25) {
              ctx.drawImage(
                bombImg,
                this.coordX + this.size / 4,
                this.coordY + this.size / 4,
                10,
                10,
              );
            } else {
              ctx.drawImage(
                bombImg,
                this.coordX + this.size / 4,
                this.coordY + this.size / 4,
                20,
                20,
              );
            }
          };
        } else {
          switch (this.nearestBombsCount) {
            case 1:
              ctx.fillStyle = '#D5F5E3 ';
              break;
            case 2:
              ctx.fillStyle = '#D4E6F1';
              break;
            case 3:
              ctx.fillStyle = '#E8DAEF';
              break;
            case 4:
              ctx.fillStyle = '#EBDEF0';
              break;
            case 5:
              ctx.fillStyle = '#FCF3CF';
              break;
            case 6:
              ctx.fillStyle = '#FDEBD0';
              break;
            case 7:
              ctx.fillStyle = '#FADBD8';
              break;
            case 8:
              ctx.fillStyle = '#F2D7D5';
              break;
            default:
              ctx.fillStyle = '#EBF5FB ';
              break;
          }
        }
        this.createCell();
        if (this.nearestBombsCount > 0) {
          ctx.font = '30px Arial';
          if (columns === 15) {
            ctx.font = '20px Arial';
          }
          if (columns === 25) {
            ctx.font = '12px Arial';
          }
          ctx.fillStyle = '#154360';
          ctx.textAlign = 'center';
          if (columns === 25) {
            ctx.fillText(
              this.nearestBombsCount,
              this.coordX + this.size / 2,
              this.coordY + this.size - 4,
            );
          }
          if (columns === 15) {
            ctx.fillText(
              this.nearestBombsCount,
              this.coordX + this.size / 2,
              this.coordY + this.size - 6,
            );
          }
          if (columns === 10) {
            ctx.fillText(
              this.nearestBombsCount,
              this.coordX + this.size / 2,
              this.coordY + this.size - 10,
            );
          }
        }
      } else {
        ctx.fillStyle = 'lightblue';
        this.createCell();
      }
      if (this.isFlagged) {
        ctx.fillStyle = '#F9E79F';
        this.createCell();
        const rabbitImg = new Image();
        rabbitImg.src = './assets/rabbit.png';
        rabbitImg.onload = () => {
          if (columns === 25) {
            ctx.drawImage(
              rabbitImg,
              this.coordX + this.size / 4,
              this.coordY + this.size / 4,
              10,
              10,
            );
          } else {
            ctx.drawImage(
              rabbitImg,
              this.coordX + this.size / 4,
              this.coordY + this.size / 4,
              20,
              20,
            );
          }
        };
      }
      if (this.nearestBombsCount === 0 && !this.isShown) {
        this.openEmptyCells();
      }
    }

    showCell() {
      this.isShown = true;
      if (this.nearestBombsCount === 0) {
        this.openEmptyCells();
      }
    }

    openEmptyCells() {
      for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          const indexX = this.i + offsetX;
          const indexY = this.j + offsetY;
          if (indexX > -1 && indexX < columns && indexY > -1 && indexY < rows) {
            const neighbourCell = gameField[indexX][indexY];
            if (!neighbourCell.isBomb && !neighbourCell.isShown) {
              neighbourCell.showCell();
            }
          }
        }
      }
    }
  }
  // generate bombs layout and add them to array

  function createBombsLayout(columns, rows, bombs) {
    for (let i = 0; i < bombs; i += 1) {
      const rowI = Math.floor(Math.random() * rows);
      const colI = Math.floor(Math.random() * columns);
      if (!gameField[rowI][colI].isBomb) {
        gameField[rowI][colI].isBomb = true;
      } else {
        i -= 1;
      }
    }
  }
  // create and draw game field with randomly set bombs
  function createGameField(columns, rows, bombs) {
    for (let i = 0; i < columns; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        gameField[i][j] = new Cell(cellSize, i, j);
      }
    }
    createBombsLayout(columns, rows, bombs);
    // count nearest bombs and add their count to array
    for (let i = 0; i < columns; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        gameField[i][j].countNeigbourBombs();
      }
    }
  }

  const drawGameField = (columns, rows) => {
    for (let i = 0; i < columns; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        gameField[i][j].render();
      }
    }
  };

  createGameField(columns, rows);
  drawGameField(columns, rows);

  // game win/lose modal
  function showModal(status) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    if (status === 'lose') {
      modal.innerHTML = ` <div class="modal-content">
      <span class="close">x</span>
      <p>Game over! Fox caught the bunny!</p>
      <img class="modal-img" src="./assets/rabbit-lose.svg"/>
    </div>
    `;
    } else {
      modal.innerHTML = ` <div class="modal-content">
      <span class="close">x</span>
      <p>You win! Bunny ran away from fox!</p>
      <img class="modal-img" src="./assets/rabbit-win.svg"/>
    </div>
    `;
    }
    body.appendChild(modal);
    const close = document.querySelector('.close');
    modal.style.display = 'block';
    close.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  // game over function
  function gameOver() {
    for (let i = 0; i < columns; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        gameField[i][j].showCell();
        gameField[i][j].render();
      }
    }
    clearInterval(startTimer);
    playSound('lose');
    showModal('lose');
  }
  // get coordinates of cell and change it's status
  canvas.addEventListener('click', (e) => {
    const ctxRect = canvas.getBoundingClientRect();
    const ctxX = Math.round(e.clientX - ctxRect.left);
    const ctxY = Math.round(e.clientY - ctxRect.top);
    const i = Math.floor(ctxX / cellSize);
    const j = Math.floor(ctxY / cellSize);
    const currentCell = gameField[i][j];
    playSound('click');
    if (!currentCell.isShown && !currentCell.isBomb) {
      openCells += 1;
    }

    if (currentCell.nearestBombsCount === 0) {
      currentCell.openEmptyCells();
      currentCell.render();
      clicksCount += 1;
    } else if (currentCell.isBomb) {
      gameOver();
    } else {
      currentCell.showCell();
      currentCell.render();
      clicksCount += 1;
    }
    menuClickCount.innerHTML = clicksCount;
  });
  // highscore show
  function showHighScore() {
    if (window.localStorage.getItem('highscore')) {
      const results = JSON.parse(window.localStorage.getItem('highscore'));
      if (results.length > 10) {
        results.slice(-10);
      }
      const resultsList = document.createElement('ol');
      highscore.innerHTML = `
      <div class="container">
        <h2>highscore</h2>
      </div>`;
      highscore.querySelector('.container').appendChild(resultsList);
      results.forEach((result) => {
        resultsList.innerHTML += `<li>Time: ${result.time} and ${result.clicks} clicks</li>`;
      });
    }
  }
  // start game
  const freeCells = gameField.flat().length - currentBombsInput;
  const startBtn = document.querySelector('.start-btn');
  function startGame() {
    columns = gameSettings[currDifficulty].columns;
    rows = gameSettings[currDifficulty].rows;
    cellSize = Math.floor(parseInt(canvas.width, 10) / columns);
    const field = generateInitMatrix(columns, rows);
    gameField = field;
    createGameField(columns, rows, currentBombsInput);
    drawGameField(columns, rows);
    totalTime = 0;
    bombsFound = 0;
    clicksCount = 0;
    flagsCount = currentBombsInput;
    menuFlagsCount.innerHTML = flagsCount;
    showHighScore();
    startTimer = setInterval(initTimer, 1000);
    openCells = gameField.flat().filter((cell) => cell.isShown).length;
  }
  // game win
  const highscoreArray = [];
  function winGame(bombs, flags) {
    if (flags === 0 && bombs === currentBombsInput && openCells === freeCells) {
      playSound('win');
      showModal('win');
      // localStorage
      const gameStats = {
        time: totalTime,
        clicks: clicksCount,
        flags: flagsCount,
      };
      window.localStorage.setItem('gameStats', JSON.stringify(gameStats));
      highscoreArray.push(gameStats);
      window.localStorage.setItem('highscore', JSON.stringify(highscoreArray));
    }
  }

  // add flags
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const ctxRect = canvas.getBoundingClientRect();
    const ctxX = Math.round(e.clientX - ctxRect.left);
    const ctxY = Math.round(e.clientY - ctxRect.top);
    const i = Math.floor(ctxX / cellSize);
    const j = Math.floor(ctxY / cellSize);
    playSound('click');
    if (!gameField[i][j].isFlagged) {
      gameField[i][j].isFlagged = true;
      gameField[i][j].render();
      flagsCount -= 1;
      if (flagsCount < 0) {
        flagsCount = 0;
      }
      if (gameField[i][j].isBomb) {
        bombsFound += 1;
      }
    } else if (gameField[i][j].isFlagged) {
      gameField[i][j].isFlagged = false;
      gameField[i][j].render();
      flagsCount += 1;
    }
    clicksCount += 1;

    menuClickCount.innerHTML = clicksCount;
    menuFlagsCount.innerHTML = flagsCount;
    winGame(bombsFound, flagsCount);
  });

  // start game
  startBtn.addEventListener('click', startGame);
  startGame();
});

//
