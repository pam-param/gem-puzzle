import { createElement } from '../helpers.js';
import Menu from './Menu.js';

class MainMenu extends Menu {
  constructor(startGame, openLevelMenu, openRecordsMenu, openSavedGamesMenu) {
    super();
    this.startGame = startGame;
    this.openLevelMenu = openLevelMenu;
    this.openRecordsMenu = openRecordsMenu;
    this.openSavedGamesMenu = openSavedGamesMenu;
  }

  init() {
    super.init();
    this.open();

    const startGameButton = createElement(
      {
        tag: 'button',
        classes: ['menu-button'],
        innerText: 'New game'
      }
    );
    const settingsButton = createElement(
      {
        tag: 'button',
        classes: ['menu-button'],
        innerText: 'Settings'
      }
    );
    const scoreButton = createElement(
      {
        tag: 'button',
        classes: ['menu-button'],
        innerText: 'Best scores'
      }
    );
    const savedGamesButton = createElement(
      {
        tag: 'button',
        classes: ['menu-button'],
        innerText: 'Saved games'
      }
    );

    this.menu.append(startGameButton, settingsButton, scoreButton, savedGamesButton);

    startGameButton.addEventListener('click', () => {
      this.startGame();
      this.close();
    });

    settingsButton.addEventListener('click', () => {
      this.close();
      this.openLevelMenu();
    });

    scoreButton.addEventListener('click', () => {
      this.close();
      this.openRecordsMenu();
    });

    savedGamesButton.addEventListener('click', () => {
      this.close();
      this.openSavedGamesMenu();
    });
  }
}

export default MainMenu;
