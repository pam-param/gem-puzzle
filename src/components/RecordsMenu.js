import { createElement, getRecords } from '../helpers.js';
import MenuWithBackButton from './MenuWithBackButton.js';

class RecordsMenu extends MenuWithBackButton {
  constructor(openMainMenu) {
    super(openMainMenu);
  }

  init() {
    super.init('Best scores');
  }

  open() {
    this.fillRecordsMenu();
    super.open();
  }

  fillRecordsMenu() {
    let recordsList = document.querySelector('.records');

    if (recordsList) {
      recordsList.remove();
    }

    recordsList = createElement(
      {
        tag: 'ol',
        classes: ['records']
      }
    );
    this.menu.append(recordsList);

    const records = getRecords();

    const recordsElements = records.map((record, index) => {
      const myInnerHTML = '<div>'+ String(index + 1) + '.'  + '</div>'
        + '<div>'+ record.time + '</div>'
        + '<div>' +record.moves + ' moves' + '</div>'
        + '<div>' + record.size + '</div>';

      return createElement(
        {
          tag: 'li',
          classes: ['records-item'],
          innerHTML: myInnerHTML
        }
      );
    });

    recordsList.append(...recordsElements);
  }
}

export default RecordsMenu;
