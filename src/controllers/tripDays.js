const StatusCodesEsc = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
};

const SortingFunction = {
  TIME: (a, b) => (a.endDate - a.startDate) - (b.endDate - b.startDate),
  PRICE: (a, b) => a.price - b.price,
  EVENT: (a, b) => b.randomWaypointItem - a.randomWaypointItem,
};

const mainTripEventsElement = document.querySelector(`.trip-events`);

import MainSortTripComponent, {SortType} from '../components/create-site-maintContent-filter-sort.js';
import MainNumberDayComponent from '../components/create-site-maintContent-day.js';
import MainListWaypointComponent from '../components/create-site-maintContent-listWaypoint.js';
import MainEditFormComponent from '../components/create-site-maintContent-edit-form.js';
import MainWaypointItemComponent from '../components/create-site-maintContent-waypoint.js';

import {renderTemplate, RenderPosition, raplaceElement} from '../utils/render.js';

import {generateSortOptions} from '../mock/sortOption.js';

const sortOptions = generateSortOptions();

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

const getSortedCards = (cards, sortType) => {
  let sortedCards = [];
  const showingCards = cards.slice();

  if (sortType === SortType.TIME) {
    sortedCards = showingCards.sort(SortingFunction.TIME);
  }
  if (sortType === SortType.PRICE) {
    sortedCards = showingCards.sort(SortingFunction.PRICE);
  }
  if (sortType === SortType.EVENT) {
    sortedCards = showingCards.sort(SortingFunction.EVENT);
  }

  return sortedCards;
};

const renderTripDays = (days, container, cardsSort) => {

  days.map((card, index) => {
    const numberDay = new MainNumberDayComponent(card, index);
    const mainListWaypoint = new MainListWaypointComponent();

    renderTemplate(container, numberDay, RenderPosition.BEFOREEND);

    renderTemplate(numberDay.getElement(), mainListWaypoint, RenderPosition.BEFOREEND);

    const mainListWaypointElement = mainListWaypoint.getElement();
    cardsSort.forEach((countCard) => {
      renderTripCard(mainListWaypointElement, countCard);
    });
  });
};

export default class TripDaysController {

  constructor(container) {
    this._container = container;
    this._sortComponent = new MainSortTripComponent(sortOptions);
  }

  renderDays(daysTrip, cardsTrip) {

    const mainTripDaysListElement = this._container.getElement();

    renderTemplate(mainTripEventsElement, this._sortComponent, RenderPosition.AFTERBEGIN);

    renderTemplate(mainTripEventsElement, this._sortComponent, RenderPosition.AFTERBEGIN);

    this._sortComponent.getElement().remove();
    renderTemplate(mainTripEventsElement, this._sortComponent, RenderPosition.AFTERBEGIN);

    renderTripDays(daysTrip, mainTripDaysListElement, cardsTrip);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {

      const sortedCards = getSortedCards(cardsTrip, sortType);

      this._sortComponent.getElement().remove();
      renderTemplate(mainTripEventsElement, this._sortComponent, RenderPosition.AFTERBEGIN);

      mainTripDaysListElement.innerHTML = ``;

      renderTripDays(daysTrip, mainTripDaysListElement, sortedCards);
    });
  }
}
