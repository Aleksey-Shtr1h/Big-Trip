import AbstractComponent from './abstract-component.js';

export const MenuItem = {
  TABLE: `control__table`,
  STATISTICS: `control__statistic`,
};

const createMenuTripTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a id="control__table" class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a id="control__statistic" class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {

  constructor() {
    super();
    this._activeIdItem = null;
    this._oldActive = this.getElement().querySelector(`#control__table`);
  }

  getTemplate() {
    return createMenuTripTemplate();
  }

  setActiveItem(checkItem) {
    const menuItemId = this.getElement().querySelector(`#${checkItem}`);

    if (this._activeIdItem === checkItem) {
      this._oldActive.classList.remove(`trip-tabs__btn--active`);
      menuItemId.classList.add(`trip-tabs__btn--active`);
    }

    this._oldActive = menuItemId;
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {

      if (evt.target.tagName !== `A`) {
        return;
      }
      evt.preventDefault();

      const menuItem = evt.target.id;
      this._activeIdItem = menuItem;
      handler(menuItem);
    });
  }

}
