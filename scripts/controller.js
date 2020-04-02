export default class Controller {
  constructor(game, view) {
    this.game = game;
    this.view = view;
  }

  play(size) {
    this.game.setState(size);
    this.view.setState(size).then(() => {
      const { playfield } = this.game.getState();
      this.view.renderPlayfield(playfield);
    })
  }
}
