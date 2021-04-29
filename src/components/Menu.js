import { createElement } from '../helpers.js';

class Menu {
  constructor() {
    this.init();
  }

  init() {
    this.menu = createElement(
      {
        tag: 'div',
        classes: [
          'menu',
          'closed-menu'
        ]
      }
    );
  }

  close() {
    this.menu.classList.add('closed-menu');
  }

  open() {
    this.menu.classList.remove('closed-menu');
  }

  getElement() {
    return this.menu;
  }
}

export default Menu;
