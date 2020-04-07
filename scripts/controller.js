export default class Controller {
  constructor(game, view, menu) {
    this.game = game;
    this.view = view;
    this.menu = menu;
    this.canvas = this.view.canvas;
    this.container = this.menu.container;

    this.timerId = null;
    this.time = 0;
    this.steps = 0;
    this.isPlaying = false;
    this.size = 4;
    this.name = null;

    document.onkeydown = this.handleKeyDown.bind(this);
    this.container.onclick = this.containerClick.bind(this);
    this.canvas.onclick = this.canvasClick.bind(this);
    this.canvas.onmousedown = this.handleMouseDown.bind(this);
  }

  play(size) {
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

  //   update() {
  //     // this.game.movePieceDown();
  //     this.updateView();

  updateGame(imgPrevX, imgPrevY, imgNextX, imgNextY, imgNum) {
    const { playfield, isGameOver } = this.game.getState();
    if (isGameOver) {
      this.view.renderEndScreen();
    } else if (!this.isPlaying) {
    //   this.view.renderPauseScreen();
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
    this.view.renderTimePanel(`${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`);
  }

  updateSteps() {
    this.view.renderStepPanel(this.steps);
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

  handleKeyDown(event) {
    const state = this.game.getState();

    switch (event.keyCode) {
      case 13: // ENTER
        if (!state.isGameOver) {
          this.play(this.size);
        }
        break;
      default:
        break;
    }
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
      this.updateGame()
      this.canvas.removeEventListener('mousemove', handleMouseMove);
      this.canvas.onmouseup = null;
      isMoving = false;
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

  openMainMenu() {
    this.menu.openMainMenu();
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

  changeDifficulty(target) {
    const difficulty = target.innerHTML[0];
    this.difficulty = difficulty;
    this.openMainMenu();
  }

  containerClick(event) {
    const target = event.target;
    if (!target.hasAttribute('data-action')) return;
    const action = target.getAttribute('data-action');
    this[action](target);
  }
}
