export default class Menu {
  constructor(container) {
    this.container = container;
    this.mainMenuList = [
      {
        inner: 'New game',
        action: 'openStartForm'
      },
      {
        inner: 'Load',
        action: 'openSaveMenu'
      },
      {
        inner: 'Difficulty',
        action: 'openDifficultyMenu'
      },
      {
        inner: 'Scores',
        action: 'openScoresMenu'
      },
      {
        inner: 'Exit',
        action: 'exit'
      }
    ];
    this.mainMenu = this.createMainMenu();
    this.saveList = this.getSaves();
    this.saveMenu = this.createSaveMenu();
    this.difficultyList = this.getDifficultiesList();
    this.difficultyMenu = this.createDifficultyMenu();
    this.scoresList = this.getScores();
    this.scoresMenu = this.createScoresMenu();
    this.button = this.createBackButton();
    this.form = this.createForm();
    this.headline = this.createHeadline();
    this.submit = this.form.querySelector('[type=submit]');
  }

  createMainMenu() {
    const list = document.createElement('ul');
    list.classList.add('menu');
    for (let i = 0; i < this.mainMenuList.length; i++) {
      const li = document.createElement('li');
      li.classList.add('menu__item');
      li.setAttribute('data-action', this.mainMenuList[i].action);
      li.innerHTML = this.mainMenuList[i].inner;
      list.append(li);
    }
    return list;
  }

  // eslint-disable-next-line class-methods-use-this
  getSaves() {
    // const list = JSON.parse(localStorage.getItem('gamePuzzleSaves'));
    const list = [
      {
        name: 'Taras',
        size: 4,
        playfield: [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 0]
        ],
        emptyCoord: '33',
        isGameOver: false,
        steps: 20,
        time: 600,
        date: '16.07'
      },
      {
        name: 'Taras',
        size: 4,
        playfield: [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 0]
        ],
        emptyCoord: '33',
        isGameOver: false,
        steps: 20,
        time: 600,
        date: '13.07'
      },
      {
        name: 'Taras',
        size: 4,
        playfield: [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 0]
        ],
        emptyCoord: '33',
        isGameOver: false,
        steps: 20,
        time: 600,
        date: '18.07'
      }
    ];
    return list;
  }

  createSaveMenu() {
    const list = document.createElement('ul');
    list.classList.add('menu');
    for (let i = 0; i < this.saveList.length; i++) {
      const li = document.createElement('li');
      const { name, size, date } = this.saveList[i];
      li.classList.add('menu__item');
      li.setAttribute('data-action', 'loadSave');
      li.innerHTML = `Name: ${name}  size: ${size}x${size}  date: ${date}`;
      list.append(li);
    }
    return list;
  }

  // eslint-disable-next-line class-methods-use-this
  getDifficultiesList() {
    const list = [];
    for (let i = 3; i <= 8; i++) {
      list.push(`${i}x${i}`);
    }
    return list;
  }

  createDifficultyMenu() {
    const list = document.createElement('ul');
    list.classList.add('menu');
    for (let i = 0; i < this.difficultyList.length; i++) {
      const li = document.createElement('li');
      li.classList.add('menu__item');
      li.setAttribute('data-action', 'changeDifficulty');
      li.innerHTML = this.difficultyList[i];
      list.append(li);
    }
    return list;
  }

  // eslint-disable-next-line class-methods-use-this
  getScores() {
    // const list = JSON.parse(localStorage.getItem('gamePuzzleScores'));
    const list = [
      {
        name: 'Taras',
        size: 4,
        steps: 20,
        time: 600
      },
      {
        name: 'Ilya',
        size: 4,
        steps: 20,
        time: 600
      },
      {
        name: 'Kesha',
        size: 4,
        steps: 20,
        time: 600
      }
    ];
    return list;
  }

  createScoresMenu() {
    const list = document.createElement('ul');
    list.classList.add('menu');
    for (let i = 0; i < this.scoresList.length; i++) {
      const li = document.createElement('li');
      const {
        name, size, steps, time
      } = this.scoresList[i];
      li.classList.add('menu__item');
      li.innerHTML = `Name: ${name}  size: ${size}x${size}  steps: ${steps}  time: ${time}`;
      list.append(li);
    }
    return list;
  }

  // eslint-disable-next-line class-methods-use-this
  createForm() {
    const form = document.createElement('form');
    form.classList.add('form');

    const input = document.createElement('input');
    input.setAttribute('id', 'name');
    input.setAttribute('type', 'text');

    const label = document.createElement('label');
    label.setAttribute('for', 'name');
    label.innerHTML = 'Write your name, please:';

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.value = 'Start';

    form.append(label, input, submit);
    return form;
  }

  // eslint-disable-next-line class-methods-use-this
  createBackButton() {
    const button = document.createElement('button');
    button.classList.add('back-button');
    button.setAttribute('data-action', 'openMainMenu');
    button.innerHTML = 'Back';
    return button;
  }

  // eslint-disable-next-line class-methods-use-this
  createHeadline() {
    const headline = document.createElement('h1');
    headline.innerHTML = 'Gem puzzle';
    return headline;
  }

  clearContainer() {
    while (this.container.children.length > 0) {
      this.container.firstChild.remove();
    }
  }

  openMainMenu() {
    this.clearContainer();
    this.container.append(this.headline);
    this.container.append(this.mainMenu);
  }

  openSaveMenu() {
    this.clearContainer();
    this.container.append(this.headline);
    this.container.append(this.saveMenu);
    this.container.append(this.button);
  }

  openDifficultyMenu() {
    this.clearContainer();
    this.container.append(this.headline);
    this.container.append(this.difficultyMenu);
    this.container.append(this.button);
  }

  openScoresMenu() {
    this.clearContainer();
    this.container.append(this.headline);
    this.container.append(this.scoresMenu);
    this.container.append(this.button);
  }

  openStartForm() {
    this.clearContainer();
    this.container.append(this.headline);
    this.container.append(this.form);
    this.container.append(this.button);
  }

  // eslint-disable-next-line class-methods-use-this
}
