import AbstractComponent from './abstract-component.js';

const createInfoTripTemplate = () => {
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>`
  );
};

export default class InfoContainer extends AbstractComponent {
  constructor(cardsModel) {
    super();
    this._cardsModel = cardsModel._cards;
  }

  getTemplate() {
    return createInfoTripTemplate(this._cardsModel);
  }

}
