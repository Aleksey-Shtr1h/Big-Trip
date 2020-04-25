import AbstractComponent from './abstract-component.js';

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

const createSortOptionMarkup = (option, isChecked) => {
  const {name, type} = option;

  return (
    `<div class="trip-sort__item  trip-sort__item--${name}">

      <input id="sort-${name}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${name}"
      ${isChecked ? `checked` : ``}>

      <label class="trip-sort__btn" for="sort-${name}" data-sort-type="${type}">
        ${name}

        ${isChecked ? `` : `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
        </svg>`}

      </label>
    </div>`
  );
};

const createSortTripTemplate = (sortOptions) => {

  const sortOptionMarkup = sortOptions.map((it, i) => {
    return createSortOptionMarkup(it, i === 0);
  }).join(`\n \n`);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>

      ${sortOptionMarkup}

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class SortTrip extends AbstractComponent {
  constructor(sortOptions) {
    super();
    this._sortOptions = sortOptions;
    this._currentSortType = SortType.EVENT;
  }

  getTemplate() {
    return createSortTripTemplate(this._sortOptions);
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeHandler(handler) {

    this.getElement().addEventListener(`click`, (evt) => {

      evt.preventDefault();

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });

  }
}
