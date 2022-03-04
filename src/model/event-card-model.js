import {FilterType} from '../constants.js';
import {getCardsByFilter} from '../utils/filter-utils.js';

export default class CardsModel {
  constructor() {
    this._cards = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._filterBtnClickChangeHandlers = [];
  }


  getCards() {
    return getCardsByFilter(this._cards, this._activeFilterType).slice();
  }

  getCardsAll() {
    return this._cards;
  }

  setCards(cards) {
    this._cards = Array.from(cards);
    this._callHandlers(this._dataChangeHandlers);
  }

  addCards(card) {
    this._cards = [].concat(card, this._cards);

    this._callHandlers(this._dataChangeHandlers);
  }

  removeCards(id) {
    const index = this._cards.findIndex((cardEvent) => cardEvent.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), this._cards.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updateCards(id, card) {
    const index = this._cards.findIndex((cardEvent) => cardEvent.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), card, this._cards.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterBtnClickChangeHandlers(handler) {
    this._filterBtnClickChangeHandlers.push(handler);
  }

  setFilterBtnClick(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterBtnClickChangeHandlers);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
