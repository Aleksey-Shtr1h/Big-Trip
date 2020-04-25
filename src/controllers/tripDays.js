const StatusCodesEsc = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
};

const mainTripEventsElement = document.querySelector(`.trip-events`);

import MainSortTripComponent, {SortType} from '../components/create-site-maintContent-filter-sort.js';
import MainNumberDayComponent from '../components/create-site-maintContent-day.js';
import MainListWaypointComponent from '../components/create-site-maintContent-listWaypoint.js';
import MainEditFormComponent from '../components/create-site-maintContent-edit-form.js';
import MainWaypointItemComponent from '../components/create-site-maintContent-waypoint.js';

import {renderTemplate, RenderPosition, raplaceElement} from '../utils/render.js';
import {getRandomIntegerNumber} from '../utils/common.js';


import {generateSort} from '../mock/sortOption.js';

const sortOptions = generateSort();
const tripList = getRandomIntegerNumber(2, 5);

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

const getSortedCards = (cards, sortType, from, to) => {
  let sortedCards = [];
  const showingCards = cards.slice();
  switch (sortType) {
    case SortType.TIME:
      sortedCards = showingCards.sort((a, b) => (a.endDate - a.startDate) - (b.endDate - b.startDate));
      break;
    case SortType.PRICE:
      sortedCards = showingCards.sort((a, b) => a.price - b.price);
      break;
    case SortType.EVENT:
      sortedCards = showingCards.sort((a, b) => a.randomWaypointItem - b.randomWaypointItem);
      break;
  }

  return sortedCards.slice(from, to);
};

const renderTripDays = (cardsTrip, container, cardsSort) => {
  cardsTrip.map((card, index) => {
    const numberDay = new MainNumberDayComponent(card, index);
    const mainListWaypoint = new MainListWaypointComponent();

    renderTemplate(container, numberDay, RenderPosition.BEFOREEND);

    renderTemplate(numberDay.getElement(), mainListWaypoint, RenderPosition.BEFOREEND);

    const mainListWaypointElement = mainListWaypoint.getElement();
    cardsSort.slice(0, tripList).forEach((countCard) => {
      renderTripCard(mainListWaypointElement, countCard);
    });
  });
};

export default class TripDaysController {

  constructor(container) {
    this._container = container;
    this._sortComponent = new MainSortTripComponent(sortOptions);
  }

  renderDays(cardsTrip) {

    const mainTripDaysListElement = this._container.getElement();

    renderTemplate(mainTripEventsElement, this._sortComponent, RenderPosition.AFTERBEGIN);

    renderTripDays(cardsTrip, mainTripDaysListElement, cardsTrip);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {

      const sortedCards = getSortedCards(cardsTrip, sortType, 0, tripList);

      mainTripDaysListElement.innerHTML = ``;

      renderTripDays(cardsTrip, mainTripDaysListElement, sortedCards);
    });
  }
}
