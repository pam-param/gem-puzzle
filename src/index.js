import { DEFAULT_SIZE } from './constants.js';
import { createElement, formatTime, getRecords } from './helpers.js';
import sound from './assets/sounds/move.mp3';

import GamePanel from './components/GamePanel';
import Board from './components/Board';
import MainMenu from './components/MainMenu.js';
import RecordsMenu from './components/RecordsMenu.js';
import LevelMenu from './components/LevelMenu.js';
import SavedGamesMenu from './components/SavedGamesMenu.js';
import GameMenu from './components/GameMenu.js';


const FifteenGame = {
  size: DEFAULT_SIZE,
  isRunning: false,
  isSoundOn: true,
  isNumbersMode: false,
  movesNumber: 0,
  timeValue: 0,

  main: null,

  mainMenu: null,
  levelMenu: null,
  savedGamesMenu: null,
  recordsMenu: null,
  gamePanel: null,
  board: null,

  audio: null,

  init() {
    this.main = document.createElement('main');
    this.main.classList.add('main');

    this.audio = createElement(
      {
        tag: 'audio',
        attributes: { 'src': sound }
      }
    );
    this.main.append(this.audio);

    this.initSize();
    this.initElements();

    const fragment = document.createDocumentFragment();
    fragment.append(this.main);
    document.body.append(fragment);
  },

  initElements() {
    this.mainMenu = new MainMenu(
      this.startGame.bind(this),
      this.openLevelMenu.bind(this),
      this.openRecordsMenu.bind(this),
      this.openSavedGamesMenu.bind(this));

    this.gamePanel = new GamePanel(this.toggleSound.bind(this));

    this.board = new Board(
      this.finishGame.bind(this),
      this.incrementMovesNumber.bind(this),
      this.playMoveSound.bind(this));

    this.gameMenu = new GameMenu(
      this.setIsRunning.bind(this),
      this.openMainMenu.bind(this),
      this.toggleIsNumbersMode.bind(this),
      this.saveGame.bind(this),
      this.solveGame.bind(this));

    this.levelMenu = new LevelMenu(
      this.startGame.bind(this),
      this.setSize.bind(this));

    this.recordsMenu = new RecordsMenu(this.openMainMenu.bind(this));

    this.savedGamesMenu = new SavedGamesMenu(
      this.openMainMenu.bind(this),
      this.startGame.bind(this));

    this.main.append(
      this.mainMenu.getElement(),
      this.gamePanel.getElement(),
      this.board.getElement(),
      this.gameMenu.getElement(),
      this.levelMenu.getElement(),
      this.recordsMenu.getElement(),
      this.savedGamesMenu.getElement());
  },

  incrementMovesNumber() {
    this.movesNumber++;
    this.gamePanel.setMovesNumber(this.movesNumber);
  },

  openMainMenu() {
    this.mainMenu.open();
  },

  closeMainMenu() {
    this.mainMenu.close();
  },

  openLevelMenu() {
    this.levelMenu.open();
  },

  openRecordsMenu() {
    this.recordsMenu.open();
  },

  openSavedGamesMenu() {
    this.savedGamesMenu.open();
  },

  initSize() {
    if (localStorage.getItem('size') !== null) {
      this.size = Number(localStorage.getItem('size'));
    }
  },

  setSize(size) {
    this.size = size;
    this.board.setSize(size);
    localStorage.setItem('size', size);
  },

  setIsRunning(isRunning) {
    this.isRunning = isRunning;
  },

  startGame(gameName = '') {
    let savedNodes = [];
    let image = '';

    if (gameName !== '') {
      const savedGame = JSON.parse(localStorage.getItem('games'))[gameName];

      if (savedGame) {
        this.size = Number(savedGame.size);
        this.movesNumber = Number(savedGame.movesNumber);
        this.timeValue = Number(savedGame.timeValue);

        savedNodes = savedGame.nodesHistory;
        image = savedGame.image;
      }
    } else {
      this.initSize();
      this.movesNumber = 0;
      this.timeValue = 0;
    }

    this.board.fillBoard(this.size, savedNodes, image);
    this.isRunning = true;

    this.updateTime();

    this.gamePanel.setMovesNumber(this.movesNumber);
    this.gamePanel.setTimeValue(this.timeValue);
  },

  saveGame() {
    this.isRunning = false;

    let savedGames = JSON.parse(localStorage.getItem('games'));
    if (!savedGames) {
      savedGames = {};
    }

    const game = {
      'size': this.size,
      'timeValue': this.timeValue,
      'movesNumber': this.movesNumber,
      'nodesHistory': this.board.getNodesHistory(),
      'image': this.board.image,
    };

    const date = new Date();
    const name = `${this.size}x${this.size} ${date.toLocaleString('ru-RU')}`;
    savedGames[name] = game;

    localStorage.setItem('games', JSON.stringify(savedGames));

    this.showMessage('The game was saved!', '', true);
  },

  finishGame() {
    this.isRunning = false;
    this.saveRecord();

    const result = `You have completed Gem-puzzle in ${this.movesNumber} moves. Your time is ${formatTime(this.timeValue)}!`;
    this.showMessage('Congratulations!', result);
  },

  saveRecord() {
    const records = getRecords();
    const currentResult = {
      'time': formatTime(this.timeValue),
      'moves': this.movesNumber,
      'size': `${this.size}x${this.size}`,
    };

    records.push(currentResult);

    records.sort((current, next) => {
      if (current.time > next.time) {
        return 1;
      }

      if (current.time < next.time) {
        return -1;
      }

      return 0;
    });

    if (records.length > 10) {
      records.pop();
    }

    localStorage.setItem('records', JSON.stringify(records));
  },

  solveGame() {
    this.isRunning = false;

    const blackout = createElement(
      {
        tag: 'div',
        classes: [
          'blackout',
          'ligth-blackout',
        ]
      }
    );
    this.main.append(blackout);

    this.board.solveGame().then(this.openSolvedMessage.bind(this));
  },

  showMessage(
    messageHeader,
    messageText = '',
    isShowResumeButton = false,
    isBlackout = true
  ) {
    let blackout;
    if (isBlackout) {
      blackout = createElement({ tag: 'div', classes: ['blackout'] });
      this.main.append(blackout);
    } else {
      blackout = document.querySelector('.blackout');
    }

    const message = createElement({ tag: 'div', classes: ['message'] });
    blackout.append(message);

    const header = createElement({ tag: 'h2', innerText: messageHeader });
    message.append(header);

    if (messageText) {
      const result = createElement({ tag: 'p', innerText: messageText });
      message.append(result);
    }

    if (isShowResumeButton) {
      const resumeButton = createElement({ tag: 'button', innerText: 'Resume' });
      message.append(resumeButton);

      resumeButton.addEventListener('click', () => {
        document.querySelector('.blackout').remove();
        this.isRunning = true;
        this.updateTime();
      });
    }

    const goToMenuButton = createElement({ tag: 'button', innerText: 'Go to main menu' });
    message.append(goToMenuButton);

    goToMenuButton.addEventListener('click', () => {
      document.querySelector('.blackout').remove();
      this.openMainMenu();
    });
  },

  openSolvedMessage() {
    this.showMessage('Success!', '', false, false);
  },

  toggleIsNumbersMode(e) {
    this.isNumbersMode = !this.isNumbersMode;

    this.board.setTilesMode(this.isNumbersMode);

    e.target.innerText = this.isNumbersMode ? "Number mode" : "Image mode";
  },

  toggleSound() {
    this.isSoundOn = !this.isSoundOn;

    this.gamePanel.toggleSound(this.isSoundOn);
  },

  updateTime() {
    if (this.isRunning) {
      this.timeValue++;
      this.gamePanel.setTimeValue(this.timeValue);

      setTimeout(() => {
        this.updateTime();
      }, 1000);
    }
  },

  playMoveSound() {
    if (this.isSoundOn) {
      this.audio.currentTime = 0;
      this.audio.play();
    }
  },
};

window.addEventListener("DOMContentLoaded", function () {
  FifteenGame.init();
});



