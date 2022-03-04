import AbstractComponent from './abstract-component.js';
import {FilterType} from '../constants.js';

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFilterMarkup = (filter, isChecked) => {
  const {name} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
      id="filter-${name}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${name}"
      ${isChecked ? `checked` : ``}>

      <label class="trip-filters__filter-label" for="filter-${name}">
        ${name}
      </label>
    </div>`
  );
};

const createFilterTripTemplate = (filters) => {
  const filterMarkup = filters.map((filter) => {
    return createFilterMarkup(filter, filter.checked);
  }).join(`\n \n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterComponent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._newEventBtn = document.querySelector(`.trip-main__event-add-btn`);
  }

  getTemplate() {
    return createFilterTripTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }

  setFilterClickBtn(handler) {
    this._newEventBtn.addEventListener(`click`, () => {
      const filterClickBtn = FilterType.EVERYTHING;
      handler(filterClickBtn);
    });
    this._newEventBtn.removeEventListener(`click`, () => {
      const filterClickBtn = FilterType.EVERYTHING;
      handler(filterClickBtn);
    });
  }
}
