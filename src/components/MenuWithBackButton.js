import { createElement } from '../helpers.js';
import Menu from "./Menu";

class MenuWithBackButton extends Menu {
  constructor(openMainMenu) {
    super();
    this.openMainMenu = openMainMenu;
  }

  init(innerText) {
    super.init();
    this.addBackButton();
    this.addHeader(innerText);
  }

  addBackButton() {
    const backButton = createElement(
      {
        tag: 'button',
        classes: ['menu-button'],
        innerText: 'Go back'
      }
    );

    this.menu.append(backButton);

    backButton.addEventListener('click', () => {
      this.close();
      this.openMainMenu();
    });
  }

  addHeader(innerText) {
    const header = createElement(
      {
        tag: 'h2',
        innerText
      }
    );

    this.menu.append(header);
  }
}

export default MenuWithBackButton;
