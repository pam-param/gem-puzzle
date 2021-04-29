import { createElement } from '../helpers.js';
import MenuWithBackButton from './MenuWithBackButton.js';

class SavedGamesMenu extends MenuWithBackButton {
  constructor(openMainMenu, startGame) {
    super(openMainMenu);
    this.startGame = startGame;
  }

  init() {
    super.init('Saved games');
    this.menu.classList.add('saved-games-menu');
  }

  fillSavedGamesMenu() {
    const gameButtons = document.querySelectorAll('.saved-games-menu-button');

    gameButtons.forEach(b => b.remove());

    const savedGames = JSON.parse(localStorage.getItem('games'));
    if (savedGames) {
      const gameButtons = Object.keys(savedGames).map(name => {
        const gameButton = createElement(
          {
            tag: 'button',
            classes: ['saved-games-menu-button'],
            innerText: name
          }
        );

        gameButton.addEventListener('click', (e) => {
          const gameName = e.target.innerText;
          this.startGame(gameName);
          this.close();
          });

        return gameButton;
      });

      this.menu.append(...gameButtons);
    }
  }

  open() {
    super.open();
    this.fillSavedGamesMenu();
  }
}

export default SavedGamesMenu;
