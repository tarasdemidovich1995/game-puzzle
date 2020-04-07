export default class Game {
  constructor() {
    this.reset();
  }

  reset() {
    this.playfield = null;
    this.size = null;
    this.emptyCoord = null;
    this.isGameOver = false;
  }

  createPlayfield(size) {
    const playfield = [];
    const randomList = this.createRandomList(size);
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        if (randomList.length > 0) {
          row.push(randomList.pop());
        } else {
          row.push(0);
          this.emptyCoord = `${y}${x}`;
        }
      }
      playfield.push(row);
    }
    return playfield;
  }

  createRandomList(num) {
    const list = [];
    for (let i = 1; i < num * num; i++) {
      list.push(i);
    }
    list.sort(() => Math.random() - 0.5);
    return list;
  }

  move(direction) {
    const y = +this.emptyCoord[0];
    const x = +this.emptyCoord[1];
    switch (direction) {
      case 'bottom':
        if (y - 1 < 0) return false;
        this.playfield[y][x] = this.playfield[y - 1][x];
        this.playfield[y - 1][x] = 0;
        this.emptyCoord = `${y - 1}${x}`;
        this.checkGameOver();
        return true;
      case 'top':
        if (y + 1 > this.size - 1) return false;
        this.playfield[y][x] = this.playfield[y + 1][x];
        this.playfield[y + 1][x] = 0;
        this.emptyCoord = `${y + 1}${x}`;
        this.checkGameOver();
        return true;
      case 'right':
        if (x - 1 < 0) return false;
        this.playfield[y][x] = this.playfield[y][x - 1];
        this.playfield[y][x - 1] = 0;
        this.emptyCoord = `${y}${x - 1}`;
        this.checkGameOver();
        return true;
      case 'left':
        if (x + 1 > this.size - 1) return false;
        this.playfield[y][x] = this.playfield[y][x + 1];
        this.playfield[y][x + 1] = 0;
        this.emptyCoord = `${y}${x + 1}`;
        this.checkGameOver();
        return true;
      default:
        throw new Error('Wrong direction in game');
    }
  }

  setState(size, playfield, emptyCoord, isGameOver) {
    this.size = size;
    if (!playfield) {
      this.playfield = this.createPlayfield(size);
    } else {
      this.playfield = playfield;
    }
    if (emptyCoord) this.emptyCoord = emptyCoord;
    if (isGameOver) this.isGameOver = isGameOver;
  }

  getState() {
    return {
      size: this.size,
      playfield: this.playfield,
      isGameOver: this.isGameOver
    }
  }

  checkGameOver() {
    let prev = this.playfield[0][0];
    for (let y = 0; y < this.playfield.length; y++) {
      for (let x = 0; x < this.playfield[y].length; x++) {
        if (y === this.playfield.length - 1 && x === this.playfield.length - 1 && this.playfield[y][x] === 0) break;
        if (this.playfield[y][x] < prev) return;
        prev = this.playfield[y][x];
      }
    }
    this.isGameOver = true;
  }
}
