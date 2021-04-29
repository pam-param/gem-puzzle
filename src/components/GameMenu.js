import { createElement } from '../helpers.js';

class GameMenu {
  constructor(setIsRunning, openMainMenu, toggleIsNumbersMode, saveGame, solveGame ) {
    this.setIsRunning = setIsRunning;
    this.openMainMenu = openMainMenu;
    this.toggleIsNumbersMode = toggleIsNumbersMode;
    this.saveGame = saveGame;
    this.solveGame = solveGame;

    this.init();
  }

  init() {
    this.menu = createElement(
      {
        tag: 'div',
        classes: ['game-menu']
      }
    );
    const openMainMenuButton = createElement(
      {
        tag: 'button',
        classes: ['game-menu-button'],
        innerText: 'Go to main menu'
      }
    );
    const modeButton = createElement(
      {
        tag: 'button',
        classes: ['game-menu-button'],
        innerText: 'Image mode'
      }
    );
    const saveGameButton = createElement(
      {
        tag: 'button',
        classes: ['game-menu-button'],
        innerText: 'Save game'
      }
    );
    const autoSolutionButton = createElement(
      {
        tag: 'button',
        classes: ['game-menu-button'],
        innerText: 'Auto solution'
      }
    );

    this.menu.append(openMainMenuButton, modeButton, saveGameButton, autoSolutionButton);

    openMainMenuButton.addEventListener('click', () => {
      this.setIsRunning(false);
      this.openMainMenu();
    });

    modeButton.addEventListener('click', (e) => {
      this.toggleIsNumbersMode(e);
    });

    saveGameButton.addEventListener('click', this.saveGame);

    autoSolutionButton.addEventListener('click', this.solveGame);
  }

  getElement() {
    return this.menu;
  }
}

export default GameMenu;
