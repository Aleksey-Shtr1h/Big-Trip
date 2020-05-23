import AbstractComponent from './abstract-component.js';

const getInfoPrice = (cards) => {
  let sumAll = 0;
  cards.map((elem) => {
    sumAll += elem.price + elem.offer.reduce((sum, value) => {
      return sum + value.price;
    }, 0);
  });
  return sumAll;
};

const createCostTripTemplate = (cards) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getInfoPrice(cards)}</span>
    </p>`
  );
};

export default class CostTrip extends AbstractComponent {
  constructor(cardsModel) {
    super();
    this._cardsModel = cardsModel;
  }

  getTemplate() {
    return createCostTripTemplate(this._cardsModel);
  }

}
