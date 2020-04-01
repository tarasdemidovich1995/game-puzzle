export default class Game {
  constructor() {
    this.time = 0;
    this.steps = 0;
    this.playfield = null;
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

  reset() {
    this.playfield = null;
  }
}
