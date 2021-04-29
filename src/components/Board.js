import { createElement, getRandomInteger } from '../helpers.js';
import FifteenNodes from '../FifteenNodes';
const images = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png'];
const prefix = './images/';

class Board {
  constructor(finishGame, incrementMovesNumber, playMoveSound) {
    this.finishGame = finishGame;
    this.incrementMovesNumber = incrementMovesNumber;
    this.playMoveSound = playMoveSound;

    this.init();
  }

  init() {
    this.board = createElement({tag: 'span', classes: ['board']});

    this.board.addEventListener('dragover', (e) => {
      if (this.dropTile(e)) {
        if (this.isSolved()) {
          this.finishGame();
        }
      }
    });
  }

  getElement() {
    return this.board;
  }

  setSize(size) {
    this.size = size;
  }

  fillBoard(size, savedNodes = [], image = '') {
    this.size = size;
    this.nodes = new FifteenNodes(this.size, savedNodes);
    this.tiles = this.nodesToTiles(this.nodes.getLastNode());

    if (image) {
      this.image = image;
    } else {
      this.image = `url("${prefix}${images[getRandomInteger(0, images.length - 1)]}")`;
    }

    document.documentElement.style.setProperty('--imagePath', this.image);

    const myTiles = document.querySelectorAll('[data-tile-id]');
    myTiles.forEach(tile => tile.remove());

    this.initTiles();
  }

  initTiles() {
    document.documentElement.style.setProperty('--size', this.size);

    const tileElements = this.tiles.map((tile, index) => {
      let tileElement;

      if (tile !== 0) {
        const x = Math.floor((tile - 1) / this.size);
        const y = (tile - 1) % this.size;

        const percentageX = x * 100 / (this.size - 1);
        const percentageY = y * 100 / (this.size - 1);

        const positionX = `top ${percentageX}%`;
        const positionY = `left ${percentageY}%`;

        tileElement = createElement(
          {
            tag: 'div',
            classes: [
              'tile',
              'tile-image'
            ],
            attributes: {
              'draggable': true,
              'data-tile-id': String(tile),
              'style': `background-position: ${positionX + " " + positionY}; order: ${index}`
            },
            innerText: String(tile),
          }
        );

        tileElement.addEventListener('dragstart', (e) => {
          e.target.classList.add('selected');
        })

        tileElement.addEventListener('dragend', (e) => {
          e.target.classList.remove('selected');
        });

      } else {
        tileElement = createElement(
          {
            tag: 'div',
            classes: ['empty'],
            attributes: {
              'data-tile-id': String(tile),
              'style': `order: ${index}`
            }
          }
        );

        this.empty = tileElement;
      }

      tileElement.addEventListener('click', (e) => {
        if (this.moveTile(e.target)) {
          if (this.isSolved()) {
            this.finishGame();
          }
        }
      });

      return tileElement;
    });

    this.board.append(...tileElements);
  }

  moveTile(tile) {
    const tileStyle = tile.style;
    const emptyStyle = this.empty.style;

    const tileOrder = tileStyle.order;
    const emptyOrder = emptyStyle.order;

    if (!this.canMove(Number(tileOrder), Number(emptyOrder))) {
      return false;
    }

    [tileStyle.order, emptyStyle.order] = [emptyOrder, tileOrder];

    [this.tiles[tileOrder], this.tiles[emptyOrder]] = [this.tiles[emptyOrder], this.tiles[tileOrder]];

    this.nodes.addNode(this.tilesToNodes(this.tiles));
    this.incrementMovesNumber();

    this.playMoveSound();

    return true;
  }

  canMove(currentPosition, newPosition) {
    if (Math.abs(currentPosition - newPosition) === this.size) {
      return true;
    }

    if (
      Math.abs(currentPosition - newPosition) === 1
      && Math.floor(currentPosition / this.size) === Math.floor(newPosition / this.size)
    ) {
      return true;
    }

    return false;
  }

  isSolved() {
    if (this.tiles[this.tiles.length - 1] !== 0) {
      return false;
    }

    for (let i = 0; i < this.tiles.length - 1; i++) {
      if (this.tiles[i] !== i + 1) {
        return false;
      }
    }
    return true;
  }

  tilesToNodes(tiles) {
    const nodes = [];
    for (let i = 0; i < this.size * this.size; i += this.size) {
      nodes.push(tiles.slice(i, i + this.size));
    }

    return nodes;
  }

  nodesToTiles(nodes) {
    return nodes.flat();
  }

  dropTile(e) {
    e.preventDefault();

    const selectedTile = this.board.querySelector('.selected');
    const currentTile = e.target;

    if (selectedTile === currentTile || currentTile !== this.empty) {
      return false;
    }

    return this.moveTile(selectedTile);
  }

  solveGame() {
    let myTiles = document.querySelectorAll('[data-tile-id]');
    let myNodes = this.nodes.getNodes();

    return new Promise((resolve) => {
      if (myNodes.length === 0) {
        resolve(true);
      }

      const doSolutionStep = () => {
        const currentNode = myNodes.pop();
        const currentTiles = this.nodesToTiles(currentNode);

        for (const myTile of myTiles) {
          myTile.style.order = currentTiles.indexOf(Number(myTile.dataset.tileId));
        }

        this.playMoveSound();

        if (myNodes.length > 0) {
          setTimeout(doSolutionStep, 200);
        } else {
          resolve(true);
        }
      }

      doSolutionStep();
    });
  }

  setTilesMode(isNumbersMode) {
    const tileElements = document.querySelectorAll('.tile');

    tileElements.forEach((tile) => {
      tile.classList.toggle('background-image-none', isNumbersMode);
    });
  }

  getNodesHistory() {
    return this.nodes.getNodes();
  }

  getImage() {
    return this.image;
  }
}

export default Board;
