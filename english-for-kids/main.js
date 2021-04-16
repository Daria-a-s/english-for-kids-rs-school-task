import cards from './cards.js';
import Common from './common.js';
import { initCategory, btnGame, blockStars } from './categories.js';

export const cardsMedia = document.getElementsByClassName('my-card__media');
export const cardsTitle = document.getElementsByClassName('mdc-card__media-content');
export const barSection = document.getElementById('buttonLogoBar');
export const overlay = document.getElementById('overlay');
export const cardsLink = document.getElementsByClassName('link-to-category');
export const switchBar = document.getElementById('for-switch');
const menuItems = document.getElementsByClassName('mdc-list-item');
const menu = document.getElementById('menu');
let array = JSON.parse(localStorage.getItem('array'));

function updateStatistic() {
  const myTable = document.getElementsByTagName('TBODY')[0];
  array = JSON.parse(localStorage.getItem('array'));

  for (let i = 0; i < 64; i += 1) {
    myTable.rows[i].cells[0].textContent = array[0][Math.trunc(i / 8)];
    myTable.rows[i].cells[1].textContent = array[Math.trunc(i / 8) + 1][i % 8].word;
    myTable.rows[i].cells[2].textContent = array[Math.trunc(i / 8) + 1][i % 8].translation;
    myTable.rows[i].cells[3].textContent = array[Math.trunc(i / 8) + 1][i % 8].train;
    myTable.rows[i].cells[4].textContent = array[Math.trunc(i / 8) + 1][i % 8].game;
    myTable.rows[i].cells[5].textContent = array[Math.trunc(i / 8) + 1][i % 8].mistakes;
    const buffer = parseInt((array[Math.trunc(i / 8) + 1][i % 8].mistakes * 100)
    / (array[Math.trunc(i / 8) + 1][i % 8].game
    + array[Math.trunc(i / 8) + 1][i % 8].mistakes), 10);
    myTable.rows[i].cells[6].textContent = `${buffer || 0}%`;
  }
}

function chooseMenuItem() {
  document.getElementsByClassName('page-title')[0].textContent = Common.currLink;
  Array.from(menuItems).forEach((item, i) => {
    item.classList.remove('mdc-list-item--activated');
    if (Common.currLink === document.getElementsByClassName('mdc-list-item__text')[i].textContent) item.classList.add('mdc-list-item--activated');

    const listener = function f() {
      document.body.classList.remove('menu-opened');
      Common.currLink = String(cards[0][i - 1]);
      barSection.style.visibility = 'visible';
      menu.classList.remove('open-menu');
      overlay.style.display = 'none';
      setTimeout(() => {
        initCategory(i - 1);
      });
    };
    if (i !== menuItems.length - 1) menuItems[i].addEventListener('click', listener, true);
    else {
      menuItems[i].addEventListener('click', () => {
        document.getElementsByClassName('statistic')[0].style.visibility = 'visible';
        document.getElementsByClassName('statistic')[0].style.overflowY = 'scroll';
        updateStatistic();
      });
    }
  });
}

export function openMenu() {
  overlay.style.display = 'none';
  const topAppBar = document.getElementById('app-bar');
  topAppBar.addEventListener('click', () => {
    menu.classList.toggle('open-menu');
    document.body.classList.toggle('menu-opened');
    if (overlay.style.display === 'none') {
      overlay.style.display = 'block';
    } else {
      overlay.style.display = 'none';
    }
    if (switchBar.classList.contains('mdc-switch--checked')) switchBar.click();
    Common.btnStartGame = false;
    btnGame.innerHTML = '';
    chooseMenuItem();
  });
  overlay.addEventListener('click', () => {
    document.body.classList.toggle('menu-opened');
    menu.classList.toggle('open-menu');
    overlay.style.display = 'none';
  });
}

export function switchMode() {
  switchBar.addEventListener('click', () => {
    Common.play = !Common.play;
    switchBar.classList.toggle('mdc-switch--checked');
    if (switchBar.classList.contains('mdc-switch--checked')) {
      document.getElementsByClassName('mdc-switch__track')[0].textContent = 'PLAY';
      document.getElementsByClassName('mdc-switch__track')[0].style.textAlign = 'left';
    } else {
      blockStars.innerHTML = '';
      Common.btnStartGame = false;
      document.getElementsByClassName('mdc-switch__track')[0].textContent = 'TRAIN';
      document.getElementsByClassName('mdc-switch__track')[0].style.textAlign = 'right';
    }
    Array.from(cardsTitle).forEach((card) => {
      card.classList.toggle('turn-color');
    });
  });
}

export function initCards() {
  Array.from(cardsLink).forEach((card, index) => {
    cardsLink[index].style.display = 'block';
    cardsMedia[index].style.backgroundImage = `url('${cards[index + 1][0].image}')`;
    cardsTitle[index].textContent = cards[0][index];

    card.addEventListener('click', () => {
      Common.currLink = String(cards[0][index]);
      initCategory(index);
    });
  });
}

function initStatistic() {
  const myTable = document.getElementsByTagName('TBODY')[0];
  if (array == null) {
    localStorage.setItem('array', JSON.stringify(cards));
    array = JSON.parse(localStorage.getItem('array'));
  } else array = JSON.parse(localStorage.getItem('array'));
  for (let i = 1; i < 9; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      const row = document.createElement('TR');
      const cellCategory = document.createElement('TD');
      const cellWord = document.createElement('TD');
      const cellTranslation = document.createElement('TD');
      const cellTrain = document.createElement('TD');
      const cellPlay = document.createElement('TD');
      const cellMistakes = document.createElement('TD');
      const cellPercent = document.createElement('TD');
      cellCategory.appendChild(document.createTextNode(cards[0][Math.trunc(i - 1)]));
      cellWord.appendChild(document.createTextNode(cards[i][j].word));
      cellTranslation.appendChild(document.createTextNode(cards[i][j].translation));
      cellTrain.appendChild(document.createTextNode(cards[i][j].train));
      cellPlay.appendChild(document.createTextNode(cards[i][j].game));
      cellMistakes.appendChild(document.createTextNode(cards[i][j].mistakes));
      cellPercent.appendChild(document.createTextNode(cards[i][j].mistakes
        / (cards[i][j].game + cards[i][j].mistakes) || 0));
      row.appendChild(cellCategory);
      row.appendChild(cellWord);
      row.appendChild(cellTranslation);
      row.appendChild(cellTrain);
      row.appendChild(cellPlay);
      row.appendChild(cellMistakes);
      row.appendChild(cellPercent);
      myTable.appendChild(row);
    }
  }
  document.getElementsByClassName('exit')[0].addEventListener('click', () => {
    document.getElementsByClassName('statistic')[0].style.visibility = 'hidden';
    Array.from(document.getElementsByTagName('TH')).forEach((th) => {
      th.removeAttribute('data-order');
    });
    updateStatistic();
  });
}

function resetStatistic() {
  localStorage.setItem('array', JSON.stringify(cards));
  array = JSON.parse(localStorage.getItem('array'));
  Common.statisticChanged = true;
  updateStatistic();
}

function trainDifficultWords() {
  let bufferArray = [];
  for (let i = 1; i < 9; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      if (array[i][j].mistakes / (array[i][j].mistakes + array[i][j].game) > 0) {
        array[i][j].percent = array[i][j].mistakes / (array[i][j].mistakes + array[i][j].game);
        bufferArray.push(array[i][j]);
      }
    }
  }
  bufferArray.sort((a, b) => b.percent - a.percent);

  bufferArray = bufferArray.slice(0, 8);

  for (let i = 0; i < bufferArray.length; i += 1) {
    cards[9][i] = bufferArray[i];
  }
  Common.currLink = 'Special';
  initCategory(8);
  document.getElementsByClassName('statistic')[0].style.visibility = 'hidden';
}

// ресурс: https://inter-net.pro/javascript/sort-table
function getSort({ target }) {
  // eslint-disable-next-line no-param-reassign
  target.dataset.order = -(target.dataset.order || -1);
  const { order } = target.dataset;
  const index = [...target.parentNode.cells].indexOf(target);
  const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
  const comparator = (ind, orderTo) => (a, b) => orderTo * collator.compare(
    a.children[ind].innerHTML,
    b.children[ind].innerHTML,
  );

  Array.from(target.closest('table').tBodies).forEach((tBody) => {
    tBody.append(...[...tBody.rows].sort(comparator(index, order)));
  });

  Array.from(target.parentNode.cells).forEach((cell) => {
    cell.classList.toggle('sorted', cell === target);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initStatistic();
  document.getElementsByClassName('mdc-switch__track')[0].textContent = 'TRAIN';
  document.getElementsByClassName('mdc-switch__track')[0].style.textAlign = 'right';
  document.getElementsByClassName('reset')[0].addEventListener('click', resetStatistic);
  document.getElementsByClassName('trainDifWords')[0].addEventListener('click', trainDifficultWords);
  // eslint-disable-next-line no-restricted-globals
  document.querySelectorAll('.table_sort thead').forEach((tableTH) => tableTH.addEventListener('click', () => getSort(event)));
});
