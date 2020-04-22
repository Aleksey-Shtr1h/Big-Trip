import AbstractComponent from './abstract-component.js';

const createCostTripTemplate = () => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>`
  );
};

export default class CostTrip extends AbstractComponent {

  getTemplate() {
    return createCostTripTemplate();
  }

}
