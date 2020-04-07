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

    this.form = this.createForm();
    this.gameMenu = this.createGameMenu();
    // this.confirmPopup = this.createConfirmPopup();

    this.backButton = this.createBackButton();
    this.headline = this.createHeadline();

    this.time = this.gameMenu.querySelector('#time');
    this.steps = this.gameMenu.querySelector('#steps');
  }

  getName() {
    const name = this.form.querySelector('#name');
    return name.value;
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
  createGameOverMenu(steps, time) {
    const div = document.createElement('div');
    div.classList.add('game-over-menu');
    const p = document.createElement('p');
    p.innerHTML = `Congratulations, you solve the puzzle in ${steps} steps and ${time}.`;
    div.append(p);

    return div;
  }

  // eslint-disable-next-line class-methods-use-this
  getSaves() {
    const list = JSON.parse(localStorage.getItem('gamePuzzleSaves'));
    return list;
  }

  createSaveMenu() {
    const list = document.createElement('ul');
    list.classList.add('menu');
    if (!this.saveList) return list;
    for (let i = 0; i < this.saveList.length; i++) {
      const li = document.createElement('li');
      const { name, size, date } = this.saveList[i];
      li.classList.add('menu__item');
      li.setAttribute('data-action', 'loadSave');
      const month = new Date(date).getMonth() + 1 < 10
        ? '0' + (new Date(date).getMonth() + 1)
        : new Date(date).getMonth() + 1;
      const monthDay = new Date(date).getDate() < 10
        ? '0' + new Date(date).getDate()
        : new Date(date).getDate();
      li.innerHTML = `Name: ${name}  Size: ${size}x${size}  Date: ${month}:${monthDay}`;
      list.append(li);
    }
    return list;
  }

  renewSaveMenu() {
    this.saveList = this.getSaves();
    this.saveMenu = this.createSaveMenu();
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
    const list = JSON.parse(localStorage.getItem('gamePuzzleScores'));
    return list;
  }

  createScoresMenu() {
    const list = document.createElement('ul');
    list.classList.add('menu');
    if (!this.scoresList) return list;
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

  renewScoresMenu() {
    this.scoresList = this.getScores();
    this.scoresMenu = this.createScoresMenu();
  }

  // eslint-disable-next-line class-methods-use-this
  createForm() {
    const form = document.createElement('form');
    form.classList.add('form');
    form.setAttribute('action', '#');

    const input = document.createElement('input');
    input.setAttribute('id', 'name');
    input.setAttribute('type', 'text');

    const label = document.createElement('label');
    label.setAttribute('for', 'name');
    label.innerHTML = 'Write your name, please:';

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('id', 'submit');
    submit.value = 'Start';

    form.append(label, input, submit);
    return form;
  }

  // eslint-disable-next-line class-methods-use-this
  createGameMenu() {
    const gameMenuList = ['Time', 'Steps'];
    const list = document.createElement('div');
    list.classList.add('game-menu');

    const listTop = document.createElement('div');
    listTop.classList.add('game-menu__top');

    for (let i = 0; i < gameMenuList.length; i++) {
      const p = document.createElement('p');
      p.classList.add('game-menu__item');
      p.setAttribute('id', `${gameMenuList[i].toLowerCase()}`);
      listTop.append(p);
    }

    const listBottom = document.createElement('div');
    listBottom.classList.add('game-menu__bottom');
    listBottom.append(this.createSaveButton());
    listBottom.append(this.createBackButton());

    list.append(listTop);
    list.append(listBottom);

    return list;
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
  createSaveButton() {
    const button = document.createElement('button');
    button.classList.add('save-button');
    button.setAttribute('data-action', 'saveGame');
    button.innerHTML = 'Save';
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
    this.renewSaveMenu();
    this.container.append(this.headline);
    this.container.append(this.saveMenu);
    this.container.append(this.backButton);
  }

  openDifficultyMenu() {
    this.clearContainer();
    this.container.append(this.headline);
    this.container.append(this.difficultyMenu);
    this.container.append(this.backButton);
  }

  openScoresMenu() {
    this.clearContainer();
    this.renewScoresMenu();
    this.container.append(this.headline);
    this.container.append(this.scoresMenu);
    this.container.append(this.backButton);
  }

  openStartForm() {
    this.clearContainer();
    this.container.append(this.headline);
    this.container.append(this.form);
    this.container.append(this.backButton);
  }

  openGameMenu() {
    this.clearContainer();
    this.container.append(this.gameMenu);
  }

  openGameOverMenu(steps, time) {
    this.clearContainer();
    this.container.append(this.createGameOverMenu(steps, time));
    this.container.append(this.backButton);
  }
}
