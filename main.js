
import Game from './scripts/game.js';
import View from './scripts/view.js';
import Controller from './scripts/controller.js';

const game = new Game();
window.game = game;

const container = document.getElementById('container');
const view = new View(container, 808, 608);
window.view = view;

const controller = new Controller(game, view);
window.controller = controller;
