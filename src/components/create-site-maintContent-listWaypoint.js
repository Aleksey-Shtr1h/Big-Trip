import AbstractComponent from './abstract-component.js';

const createListWaypointTemplate = () => {
  return (
    `<ul class="trip-events__list">
    </ul>`
  );
};

export default class ListWaypoint extends AbstractComponent {

  getTemplate() {
    return createListWaypointTemplate();
  }

}
