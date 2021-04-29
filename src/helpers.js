import {
  SIZES,
  GOD_NUMBERS,
  MINUTES_PER_HOUR,
  SECONDS_PER_MINUTE,
} from './constants.js';

const createElement = ({
  tag,
  classes = [],
  attributes = {},
  innerText = '',
  innerHTML = '',
}) => {
  const element = document.createElement(tag);

  if (classes.length > 0) {
    element.classList.add(...classes);
  }

  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));

  if (innerText) {
    element.innerText = innerText;
  }

  if (innerHTML) {
    element.innerHTML = innerHTML;
  }

  return element;
};

const setGodNumbers = () => {
  const godNumbersMap = new Map();

  SIZES.forEach((size, index) => {
    godNumbersMap.set(size, GOD_NUMBERS[index]);
  });

  return godNumbersMap;
};

const getRandomInteger = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const formatTime = (timeValue) => {
  const hours= Math.floor(timeValue / (MINUTES_PER_HOUR * SECONDS_PER_MINUTE));
  const minutes= Math.floor((timeValue - MINUTES_PER_HOUR * hours) / SECONDS_PER_MINUTE);
  const seconds = timeValue % SECONDS_PER_MINUTE;

  return `${appendNull(hours)}:${appendNull(minutes)}:${appendNull(seconds)}`;
};

const appendNull = (number) => {
  return (number < 10) ? `0${number}`: String(number);
};

const getRecords = () => {
  let records = JSON.parse(localStorage.getItem('records'));

  if (!records) {
    records = [];
  }

  return records;
};

export {
  createElement,
  setGodNumbers,
  getRandomInteger,
  formatTime,
  getRecords,
};
