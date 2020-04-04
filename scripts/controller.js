export default class Controller {
  constructor(game, view) {
    this.game = game;
    this.view = view;
    this.canvas = this.view.canvas;
    this.timerId = null;
    this.time = 0;
    this.steps = 0;
    this.isPlaying = false;
    this.size = 7;

    document.onkeydown = this.handleKeyDown.bind(this);
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
    const playfieldX = this.view.playfieldX;
    const playfieldY = this.view.playfieldY;
    const imageWidth = this.view.imageWidth;
    const imgX = Math.floor((event.offsetX - playfieldX) / imageWidth);
    const imgY = Math.floor((event.offsetY - playfieldY) / imageWidth);
    const emptyCoordY = +this.game.emptyCoord[0];
    const emptyCoordX = +this.game.emptyCoord[1];
    switch (true) {
      case (imgY === (emptyCoordY + 1) && imgX === emptyCoordX):
        if (this.game.move('top')) {
          this.steps++;
          this.updateGame(
            playfieldX + imgX * imageWidth,
            playfieldY + imgY * imageWidth,
            playfieldX + emptyCoordX * imageWidth,
            playfieldY + emptyCoordY * imageWidth,
            this.game.playfield[emptyCoordY][emptyCoordX]
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
            this.game.playfield[emptyCoordY][emptyCoordX]
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
            this.game.playfield[emptyCoordY][emptyCoordX]
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
            this.game.playfield[emptyCoordY][emptyCoordX]
          );
        }
        break;
      default:
        break;
    }
  }
}
