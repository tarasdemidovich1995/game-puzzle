export default class Controller {
  constructor(game, view) {
    this.game = game;
    this.view = view;
    this.timerId = null;
    this.time = 0;
    this.steps = 0;
    this.isPlaying = false;

    document.onkeydown = this.handleKeyDown.bind(this);
  }

  play(size) {
    this.game.setState(size);
    this.view.renderLoadScreen();
    this.view.setState(size).then(() => {
      this.view.clearLoadScreen();
      this.isPlaying = true;
      this.updateGame();
      this.startTimer();
    })
  }

  //   update() {
  //     // this.game.movePieceDown();
  //     this.updateView();

  updateGame() {
    const { playfield, isGameOver } = this.game.getState();
    if (isGameOver) {
      this.view.renderEndScreen();
    } else if (!this.isPlaying) {
    //   this.view.renderPauseScreen();
    } else {
      this.view.renderGameScreen(playfield);
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
          this.play(3);
        }
        break;
      case 37: // left arrow
        if (this.game.move('left')) {
          this.steps++;
          this.updateGame();
        }
        break;
      case 38: // up arrow
        if (this.game.move('top')) {
          this.steps++;
          this.updateGame();
        }
        break;
      case 39: // right arrow
        if (this.game.move('right')) {
          this.steps++;
          this.updateGame();
        }
        break;
      case 40: // down arrow
        if (this.game.move('bottom')) {
          this.steps++;
          this.updateGame();
        }
        break;
      default:
        throw new Error('Handle error');
    }
  }
}
