const StatusCodesEsc = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
};

import MainNumberDayComponent from '../components/create-site-maintContent-day.js';
import MainListWaypointComponent from '../components/create-site-maintContent-listWaypoint.js';
import MainEditFormComponent from '../components/create-site-maintContent-edit-form.js';
import MainWaypointItemComponent from '../components/create-site-maintContent-waypoint.js';

import {renderTemplate, RenderPosition, raplaceElement} from '../utils/render.js';
import {getRandomIntegerNumber} from '../utils/common.js';


const renderTripCard = (cardListElement, countCard) => {

  const replaceCardToFormCard = () => {
    raplaceElement(editFormComponent, waypointItemComponent);
  };

  const replaceFormCardToCard = () => {
    raplaceElement(waypointItemComponent, editFormComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === StatusCodesEsc.ESCAPE || StatusCodesEsc.ESC;
    if (isEscKey) {
      replaceFormCardToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const waypointItemComponent = new MainWaypointItemComponent(countCard);
  waypointItemComponent.setBtnClickHandler(() => {
    replaceCardToFormCard();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const editFormComponent = new MainEditFormComponent(countCard);
  editFormComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceFormCardToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  renderTemplate(cardListElement, waypointItemComponent, RenderPosition.BEFOREEND);
};

export default class TripDaysController {

  constructor(container) {
    this._container = container;
    // this._mainListWaypoint = new MainListWaypointComponent();
  }

  renderDays(cardsTrip) {
    const mainTripDaysListElement = this._container.getElement();

    cardsTrip.map((card, index) => {
      const tripList = getRandomIntegerNumber(1, 5);

      const numberDay = new MainNumberDayComponent(card, index);

      const mainListWaypoint = new MainListWaypointComponent();

      renderTemplate(mainTripDaysListElement, numberDay, RenderPosition.BEFOREEND);

      renderTemplate(numberDay.getElement(), mainListWaypoint, RenderPosition.BEFOREEND);

      const mainListWaypointElement = mainListWaypoint.getElement();
      cardsTrip.slice(0, tripList).forEach((countCard) => {
        renderTripCard(mainListWaypointElement, countCard);
      });
    });
  }
}
