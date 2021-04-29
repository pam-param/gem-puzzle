import { SIZES } from '../constants.js';
import { createElement } from '../helpers.js';
import Menu from './Menu.js';

class LevelMenu extends Menu {
  constructor(startGame, setSize) {
    super();
    this.startGame = startGame;
    this.setSize = setSize;
  }

  init() {
    super.init();

    const levelButtons = SIZES.map(size => {
      const levelButton = createElement(
        {
          tag: 'button',
          classes: ['menu-button'],
          attributes: {'data-size': size},
          innerText: `${size} x ${size}`
        }
      );

      levelButton.addEventListener('click', (e) => {
        const size = Number(e.target.dataset.size);

        if (size) {
          this.setSize(size);
          this.startGame();
          this.close();
        }
      });

      return levelButton;
    });

    this.menu.append(...levelButtons);
  }
}

export default LevelMenu;
