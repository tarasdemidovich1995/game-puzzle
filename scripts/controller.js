export default class Controller {
  constructor(game, view, menu) {
    this.game = game;
    this.view = view;
    this.menu = menu;
    this.canvas = this.view.canvas;
    this.container = this.menu.container;

    this.reset();

    this.container.onclick = this.containerClick.bind(this);
    this.canvas.onclick = this.canvasClick.bind(this);
    this.canvas.onmousedown = this.handleMouseDown.bind(this);
    this.menu.form.onsubmit = this.handleSubmit.bind(this);
  }

  startGame(size) {
    this.game.setState(size);
    this.view.renderLoadScreen();
    this.view.setState(size).then(() => {
      setTimeout(() => {
        this.view.clearLoadScreen();
        this.isPlaying = true;
        this.updateGame();
        this.startTimer();
      }, 1200);
    });
  }

  continueGame() {
    this.view.renderLoadScreen();
    this.view.setState(this.size).then(() => {
      setTimeout(() => {
        this.view.clearLoadScreen();
        this.isPlaying = true;
        this.updateGame();
        this.startTimer();
      }, 1200);
    });
  }

  reset() {
    this.menu.time.innerHTML = '';
    this.menu.steps.innerHTML = '';
    this.stopTimer();
    this.timerId = null;
    this.time = 0;
    this.steps = 0;
    this.isPlaying = false;
    this.size = 4;
    this.name = null;
  }

  getState() {
    return {
      name: this.name,
      size: this.size,
      playfield: this.game.playfield,
      emptyCoord: this.game.emptyCoord,
      steps: this.steps,
      time: this.time,
      date: new Date(Date.now())
    }
  }

  setState(state) {
    const {
      name, size, playfield, emptyCoord, steps, time
    } = state;
    this.game.setState(size, playfield, emptyCoord, false);
    this.name = name;
    this.size = size;
    this.steps = steps;
    this.time = time;
  }

  updateGame(imgPrevX, imgPrevY, imgNextX, imgNextY, imgNum) {
    const { playfield, isGameOver } = this.game.getState();
    if (isGameOver) {
      this.openGameOverMenu();
    } else if (!this.isPlaying) {
      // add open pause menu
    } else {
      if (arguments.length > 0) {
        this.view.renderImageAnimation(imgPrevX, imgPrevY, imgNextX, imgNextY, imgNum);
      } else {
        this.view.renderGameScreen(playfield);
      }
      this.updateSteps();
      this.updateTime();
    }
  }

  updateTime() {
    const secs = this.time % 60;
    const mins = (this.time - secs) / 60;
    this.menu.time.innerHTML = `Time: ${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  }

  updateSteps() {
    this.menu.steps.innerHTML = `Steps: ${this.steps}`;
  }

  startTimer() {
    this.updateTime();
    this.timerId = setInterval(() => {
      this.time++;
      this.updateTime()
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerId);
  }

  handleMouseDown(event) {
    if (event.offsetX > this.view.playfieldX + this.view.playfieldInnerWidth) return;
    const playfieldX = this.view.playfieldX;
    const playfieldY = this.view.playfieldY;
    const imageWidth = this.view.imageWidth;
    const imgX = Math.floor((event.offsetX - playfieldX) / imageWidth);
    const imgY = Math.floor((event.offsetY - playfieldY) / imageWidth);
    const emptyCoordY = +this.game.emptyCoord[0];
    const emptyCoordX = +this.game.emptyCoord[1];
    const imgNum = this.game.playfield[imgY][imgX];

    let isMoving = false;
    let cooldown = true;

    this.canvas.onclick = this.canvasClick.bind(this);

    setTimeout(() => {
      cooldown = false;
    }, 100);

    const moveImageAt = (offsetX, offsetY) => {
      const halfImgWidth = this.view.imageWidth / 2;
      const playfieldWidth = this.view.playfieldWidth;
      const borderWidth = this.view.playfieldBorderWidth;
      let posX = offsetX;
      let posY = offsetY;
      this.game.playfield[imgY][imgX] = 0;
      if (offsetX > playfieldWidth - halfImgWidth - borderWidth) posX = playfieldWidth - halfImgWidth - borderWidth;
      if (offsetX < halfImgWidth + borderWidth) posX = halfImgWidth + borderWidth;
      if (offsetY > playfieldWidth - halfImgWidth - borderWidth) posY = playfieldWidth - halfImgWidth - borderWidth;
      if (offsetY < halfImgWidth + borderWidth) posY = halfImgWidth + borderWidth;
      this.view.renderDragNDrop(this.game.playfield, imgNum, posX, posY);
      this.canvas.onclick = null;
    }

    // eslint-disable-next-line no-shadow
    const handleMouseMove = (event) => {
      isMoving = true;
      if (!cooldown) moveImageAt(event.offsetX, event.offsetY);
    }

    this.canvas.addEventListener('mousemove', handleMouseMove);

    this.canvas.onmouseout = () => {
      if (isMoving) this.game.playfield[imgY][imgX] = imgNum;
      this.updateGame();
      this.canvas.removeEventListener('mousemove', handleMouseMove);
      this.canvas.onmouseout = null;
    };

    // eslint-disable-next-line no-shadow
    this.canvas.onmouseup = (event) => {
      const eventX = Math.floor((event.offsetX - playfieldX) / imageWidth);
      const eventY = Math.floor((event.offsetY - playfieldY) / imageWidth);
      if (eventX === emptyCoordX && eventY === emptyCoordY) {
        this.game.playfield[emptyCoordY][emptyCoordX] = imgNum;
        this.game.emptyCoord = `${imgY}${imgX}`;
        this.steps++;
      } else {
        this.game.playfield[imgY][imgX] = imgNum;
      }
      this.canvas.removeEventListener('mousemove', handleMouseMove);
      this.canvas.onmouseup = null;
      isMoving = false;
      this.game.checkGameOver();
      this.updateGame();
    }
  }

  canvasClick(event) {
    if (event.offsetX > this.view.playfieldX + this.view.playfieldInnerWidth) return;
    const playfieldX = this.view.playfieldX;
    const playfieldY = this.view.playfieldY;
    const imageWidth = this.view.imageWidth;
    const imgX = Math.floor((event.offsetX - playfieldX) / imageWidth);
    const imgY = Math.floor((event.offsetY - playfieldY) / imageWidth);
    const emptyCoordY = +this.game.emptyCoord[0];
    const emptyCoordX = +this.game.emptyCoord[1];
    const imgNum = this.game.playfield[imgY][imgX];
    switch (true) {
      case (imgY === (emptyCoordY + 1) && imgX === emptyCoordX):
        if (this.game.move('top')) {
          this.steps++;
          this.updateGame(
            playfieldX + imgX * imageWidth,
            playfieldY + imgY * imageWidth,
            playfieldX + emptyCoordX * imageWidth,
            playfieldY + emptyCoordY * imageWidth,
            imgNum
          );
        }
        break;
      case (imgY === (emptyCoordY - 1) && imgX === emptyCoordX):
        if (this.game.move('bottom')) {
          this.steps++;
          this.updateGame(
            playfieldX + imgX * imageWidth,
            playfieldY + imgY * imageWidth,
            playfieldX + emptyCoordX * imageWidth,
            playfieldY + emptyCoordY * imageWidth,
            imgNum
          );
        }
        break;
      case (imgX === (emptyCoordX + 1) && imgY === emptyCoordY):
        if (this.game.move('left')) {
          this.steps++;
          this.updateGame(
            playfieldX + imgX * imageWidth,
            playfieldY + imgY * imageWidth,
            playfieldX + emptyCoordX * imageWidth,
            playfieldY + emptyCoordY * imageWidth,
            imgNum
          );
        }
        break;
      case (imgX === (emptyCoordX - 1) && imgY === emptyCoordY):
        if (this.game.move('right')) {
          this.steps++;
          this.updateGame(
            playfieldX + imgX * imageWidth,
            playfieldY + imgY * imageWidth,
            playfieldX + emptyCoordX * imageWidth,
            playfieldY + emptyCoordY * imageWidth,
            imgNum
          );
        }
        break;
      default:
        break;
    }
  }

  saveGame() {
    const state = this.getState();
    let savesList = JSON.parse(localStorage.getItem('gamePuzzleSaves'));
    if (savesList) {
      if (savesList.length > 9) savesList.pop();
    } else {
      savesList = [];
    }
    savesList.push(state);
    localStorage.setItem('gamePuzzleSaves', JSON.stringify(savesList));
    this.openMainMenu();
  }

  // eslint-disable-next-line class-methods-use-this
  exit() {
    window.history.back();
  }

  loadSave(target) {
    const savesList = this.menu.getSaves();
    const index = Array.from(this.menu.saveMenu.children).indexOf(target);
    const state = savesList[index];
    this.setState(state);
    this.openGameMenu();
    this.continueGame(this.size);
  }

  openMainMenu() {
    this.menu.openMainMenu();
    this.container.classList.remove('container_game-mode');
    this.reset();
    this.view.clearScreen();
  }

  openSaveMenu() {
    this.menu.openSaveMenu();
  }

  openDifficultyMenu() {
    this.menu.openDifficultyMenu();
  }

  openScoresMenu() {
    this.menu.openScoresMenu();
  }

  openStartForm() {
    this.menu.openStartForm();
  }

  openGameMenu() {
    this.menu.openGameMenu();
    this.container.classList.add('container_game-mode');
  }

  openGameOverMenu() {
    this.stopTimer();
    const {
      name, size, steps, time
    } = this.getState();
    const secs = time % 60;
    const mins = (time - secs) / 60;
    const timeString = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;

    const state = {
      name: name,
      size: size,
      steps: steps,
      time: time
    };

    let scoresList = JSON.parse(localStorage.getItem('gamePuzzleScores'));
    if (!scoresList) scoresList = [];
    scoresList.push(state);
    localStorage.setItem('gamePuzzleScores', JSON.stringify(scoresList));

    this.container.classList.remove('container_game-mode');
    this.menu.openGameOverMenu(steps, timeString);
    this.game.reset();
  }

  changeDifficulty(target) {
    const difficulty = +target.innerHTML[0];
    this.size = difficulty;
    this.menu.openMainMenu();
  }

  containerClick(event) {
    const target = event.target;
    if (!target.hasAttribute('data-action')) return;
    const action = target.getAttribute('data-action');
    this[action](target);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.name = this.menu.getName() ? this.menu.getName() : 'Without name';
    this.openGameMenu();
    this.startGame(this.size);
  }
}
