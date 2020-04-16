import {createElement} from '../utils.js';

const createInfoContainerTemplate = () => {
  return (
    `<section class="trip-main__trip-info  trip-info">
    </section>`
  );
};

export default class InfoContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createInfoContainerTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

