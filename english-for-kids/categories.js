import cards from './cards.js';
import Common from './common.js';

export const cardItems = document.getElementsByClassName('my-card__media');
export const cardsTitle = document.getElementsByClassName(
  'mdc-card__media-content',
);
export const cardsLink = document.getElementsByClassName('link-to-category');
const newCardsLink = document.getElementsByClassName('link-to-item');
const rotateIcons = document.getElementsByClassName('mdc-list-item__graphic');
export const switchBar = document.getElementById('for-switch');
const sounds = document.getElementsByClassName('pronounce');
const backCards = document.getElementsByClassName('card-back');
export const btnGame = document.getElementsByClassName('button-start-game');
export const blockStars = document.getElementById('forStars');
const overlayCorrect = document.getElementsByClassName('link-to-correct');
let soundsArray = [];
let count = 0;
let stars = 0;
let wrong = 0;
const success = document.getElementById('success');
const failure = document.getElementById('failure');
let array = JSON.parse(localStorage.getItem('array'));
const startGameLabel = 'Start Game';
const repeatLabel = 'Repeat';
const errorSound = new Audio('./audio/error.mp3');
const correctSound = new Audio('./audio/correct.mp3');
const successSound = new Audio('./audio/success.mp3');
const failureSound = new Audio('./audio/failure.mp3');

function setStyles(i) {
  if (Common.play) {
    cardsTitle[i].style.display = 'none';
    cardItems[i].classList.add('imagesPlay');
    rotateIcons[i].style.visibility = 'hidden';
    newCardsLink[i].style.visibility = 'hidden';
    btnGame[0].style.visibility = 'visible';
    btnGame[0].textContent = 'Start Game';
    btnGame[0].style.backgroundColor = '#0187873c';
  } else {
    cardsTitle[i].style.display = 'block';
    cardItems[i].classList.remove('imagesPlay');
    rotateIcons[i].style.visibility = 'visible';
    newCardsLink[i].style.visibility = 'visible';
    btnGame[0].style.visibility = 'hidden';
  }
}

export function initCategory(index) {
  const currentArray = cards[index + 1];
  document.getElementsByClassName('page-title')[0].textContent = Common.currLink;
  Array.from(cardsLink).forEach((card, i) => {
    cardsLink[i].style.display = 'none';
  });

  Array.from(cardItems).forEach((card, i) => {
    if (currentArray[i].category !== undefined) {
      document.getElementsByClassName('card-wrapper')[i].style.display = 'block';
      cardItems[i].style.backgroundImage = `url('${currentArray[i].image}')`;
      cardsTitle[i].textContent = currentArray[i].word;
      sounds[i].src = `${currentArray[i].audioSrc}`;
      backCards[i].textContent = currentArray[i].translation;
    } else {
      document.getElementsByClassName('card-wrapper')[i].style.display = 'none';
    }
    setStyles(i);
    switchBar.addEventListener('click', () => {
      setStyles(i);
      soundsArray = [];
      count = 0;
      Common.gameStarted = false;
      Array.from(cardItems).forEach((cardClick, j) => {
        overlayCorrect[j].style.visibility = 'hidden';
      });
    });
  });
}

export function listenWord() {
  Array.from(newCardsLink).forEach((card, i) => {
    card.addEventListener('click', () => {
      array = JSON.parse(localStorage.getItem('array'));
      if (Common.statisticChanged) {
        array = JSON.parse(localStorage.getItem('array'));
        Common.statisticChanged = false;
      }
      array[
        array[0].indexOf(document.getElementsByTagName('h1')[0].textContent) + 1
      ][i].train += 1;
      localStorage.setItem('array', JSON.stringify(array));
      sounds[i].play();
    });
  });
}

export function rotateCard() {
  Array.from(rotateIcons).forEach((button, ind) => {
    button.addEventListener('click', () => {
      array[
        array[0].indexOf(document.getElementsByTagName('h1')[0].textContent) + 1
      ][ind].train += 1;
      localStorage.setItem('array', JSON.stringify(array));
      document
        .getElementsByClassName('category-card')[ind].classList.toggle('card-rotate');
      newCardsLink[ind].style.zIndex = '0';

      if (document.getElementsByClassName('card-back')[ind] !== undefined) {
        document
          .getElementsByClassName('card-wrapper')[ind].addEventListener('mouseleave', () => {
            document
              .getElementsByClassName('category-card')[ind].classList.remove('card-rotate');
            newCardsLink[ind].style.zIndex = '10';
          });
      }
    });
  });
}

function shuffle(arr) {
  arr.sort(() => Math.random() - 0.5);
}

function checkVisibleStars() {
  if (stars > 9) {
    blockStars.innerHTML = '';
    stars = 0;
  }
}

function checkStatisticChanging() {
  if (Common.statisticChanged) {
    array = JSON.parse(localStorage.getItem('array'));
    Common.statisticChanged = false;
  }
}

function chooseCorrectCard(i) {
  correctSound.play();
  blockStars.insertAdjacentHTML(
    'beforeend',
    '<span class="material-icons" style="color:gold; font-size:30px">star</span>',
  );
  count += 1;
  stars += 1;
  array[soundsArray[i].category + 1].find(
    (el) => el.audioSrc
            === soundsArray[i].audioSrc,
  ).game += 1;
  localStorage.setItem('array', JSON.stringify(array));
  overlayCorrect[i].style.visibility = 'visible';
}

function chooseWrongCard(i) {
  blockStars.insertAdjacentHTML(
    'beforeend',
    '<span class="material-icons" style="color:gold; font-size:30px">star_outline</span>',
  );
  wrong += 1;
  stars += 1;
  array[soundsArray[i].category + 1].find(
    (el) => el.audioSrc
      === soundsArray[i].audioSrc,
  ).mistakes += 1;
  localStorage.setItem('array', JSON.stringify(array));
  errorSound.play();
}

function clickOnCardDuringTheGame() {
  Array.from(cardItems).forEach((card, i) => {
    cardItems[i].onclick = () => {
      checkStatisticChanging();
      checkVisibleStars();
      if (
        cards[cards[0].indexOf(Common.currLink) + 1][i].audioSrc === soundsArray[count].audioSrc
      ) {
        chooseCorrectCard(i);
        cardItems[i].onclick = '';
        if (count < soundsArray.length) {
          setTimeout(() => {
            new Audio(soundsArray[count].audioSrc).play();
          }, 100);
        } else {
          if (wrong === 0) {
            successSound.play();
            success.style.visibility = 'visible';
          } else {
            failureSound.play();
            failure.style.visibility = 'visible';
            document.getElementById(
              'mistakes',
            ).textContent = `You've made ${wrong} mistakes`;
          }
          Array.from(cardItems).forEach((overlayOfCard, k) => {
            overlayCorrect[k].style.visibility = 'hidden';
          });
          setTimeout(() => {
            count = 0;
            wrong = 0;
            Common.gameStarted = false;
            soundsArray = [];
            window.location.reload();
          }, 2000);
        }
      } else {
        chooseWrongCard(i);
      }
    };
  });
}

export function startGame() {
  btnGame[0].textContent = startGameLabel;
  count = 0;
  btnGame[0].addEventListener('click', () => {
    if (btnGame[0].textContent === startGameLabel) wrong = 0;
    btnGame[0].textContent = repeatLabel;
    btnGame[0].style.backgroundColor = '#0187879a';

    if (Common.gameStarted === false) {
      for (let i = 0; i < 8; i += 1) {
        if (
          cards[cards[0].indexOf(Common.currLink) + 1][i].audioSrc !== undefined
        ) {
          soundsArray.push(
            cards[cards[0].indexOf(Common.currLink) + 1][i],
          );
        }
      }
      shuffle(soundsArray);
      Common.gameStarted = true;
      new Audio(soundsArray[count].audioSrc).play();
    } else {
      new Audio(soundsArray[count].audioSrc).play();
    }
    array = JSON.parse(localStorage.getItem('array'));
    clickOnCardDuringTheGame();
  });
}

document.addEventListener('DOMContentLoaded', startGame());
rotateCard();
