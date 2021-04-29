import { createElement, formatTime } from '../helpers.js';

class GamePanel {
  constructor(onSoundButtonClick) {
    this.onSoundButtonClick = onSoundButtonClick;

    this.init();
  }

  init() {
    const defaultValue = 0;

    this.results = createElement(
      {
        tag: 'div',
        classes: ['results']
      }
    );

    this.soundButton = createElement(
      {
        tag: 'button',
        classes: [
          'sound-button',
          'sound-on'
        ]
      }
    );

    this.soundButton.addEventListener('click', () => {
      this.onSoundButtonClick();
    });

    const movesBlock = createElement(
      {
        tag: 'div',
        classes: ['moves']
      }
    );

    const movesName = createElement(
      {
        tag: 'span',
        innerText: 'Moves: '
      }
    );

    this.moves = createElement('span', [], defaultValue);

    movesBlock.append(movesName, this.moves);

    const timeBlock = createElement('div', ['time']);

    const timeName = createElement(
      {
        tag: 'span',
        innerText: 'Time: '
      }
    );
    this.time = createElement(
      {
        tag: 'span',
        classes: ['time-value'],
        innerText: defaultValue
      }
    );

    timeBlock.append(timeName, this.time);

    this.results.append(this.soundButton, movesBlock, timeBlock);
  }

  getElement() {
    return this.results;
  }

  setMovesNumber(movesNumber) {
    this.moves.innerText = movesNumber;
  }

  setTimeValue(timeValue) {
    this.time.innerText = formatTime(timeValue);
  }

  toggleSound(isSoundOn) {
    this.soundButton.classList.toggle('sound-on', isSoundOn);
    this.soundButton.classList.toggle('sound-off', !isSoundOn);
  }
}

export default GamePanel;
