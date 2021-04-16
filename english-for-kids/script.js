import * as Main from './main.js';
import * as Categories from './categories.js';

Main.openMenu(); // чтобы открывалось меню
Main.switchMode(); // чтобы переключался ползунок
Main.initCards(); // загружаем карточки
Categories.listenWord(); // грузим звуки для карт категории
