import AbstractComponent from './abstract-component.js';

const createListWayPointTemplate = () => {
  return (
    `<ul class="trip-events__list">
    </ul>`
  );
};

export default class ListWayPoint extends AbstractComponent {

  getTemplate() {
    return createListWayPointTemplate();
  }

}
