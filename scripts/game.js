export default class Game {
  constructor() {
    this.reset();
  }

  reset() {
    this.playfield = null;
    this.size = null;
    this.emptyCoord = null;
    this.startTime = null;
    this.steps = 0;
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
    const y = this.emptyCoord[0];
    const x = this.emptyCoord[1];
    switch (direction) {
      case 'top':
        if (y - 1 < 0) return;
        this.playfield[y][x] = this.playfield[y - 1][x];
        this.playfield[y - 1][x] = 0;
        this.emptyCoord = `${y - 1}${x}`;
        this.steps++;
        break;
      case 'bottom':
        if (y + 1 > this.size) return;
        this.playfield[y][x] = this.playfield[y + 1][x];
        this.playfield[y + 1][x] = 0;
        this.emptyCoord = `${y + 1}${x}`;
        this.steps++;
        break;
      case 'left':
        if (x - 1 < 0) return;
        this.playfield[y][x] = this.playfield[y][x - 1];
        this.playfield[y][x - 1] = 0;
        this.emptyCoord = `${y}${x - 1}`;
        this.steps++;
        break;
      case 'right':
        if (x + 1 > this.size) return;
        this.playfield[y][x] = this.playfield[y][x + 1];
        this.playfield[y][x + 1] = 0;
        this.emptyCoord = `${y}${x + 1}`;
        this.steps++;
        break;
      default:
        throw new Error('Wrong direction in game');
    }
  }

  setState(size) {
    this.size = size;
    this.playfield = this.createPlayfield(size);
    this.setTime();
  }

  getState() {
    const date = this.getTime();
    const mins = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const secs = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return {
      size: this.size,
      playfield: this.playfield,
      time: `${mins}:${secs}`,
      steps: this.steps
    }
  }

  setTime() {
    this.startTime = Date.now();
  }

  getTime() {
    return new Date(Date.now() - this.startTime);
  }
}
