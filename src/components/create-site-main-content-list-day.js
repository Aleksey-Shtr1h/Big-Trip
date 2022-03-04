import AbstractComponent from './abstract-component.js';

const createTripDaysList = () => {
  return (
    `<ul class="trip-days">

    </ul>`
  );
};

export default class TripDaysList extends AbstractComponent {

  getTemplate() {
    return createTripDaysList();
  }

}
