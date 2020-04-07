
import Game from './scripts/game.js';
import View from './scripts/view.js';
import Controller from './scripts/controller.js';
import Menu from './scripts/menu.js';

const body = document.querySelector('body');
const container = document.createElement('div');
container.classList.add('container');
body.append(container)

const menu = new Menu(container);
window.menu = menu;

const game = new Game();
window.game = game;

const view = new View(container, 808, 608);
window.view = view;

const controller = new Controller(game, view, menu);
window.controller = controller;

window.onload = () => {
  menu.openMainMenu();
};
