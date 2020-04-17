import {createElement} from '../utils.js';

const createListWaypointTemplate = () => {
  return (
    `<ul class="trip-events__list">
    </ul>`
  );
};

export default class ListWaypoint {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createListWaypointTemplate();
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
