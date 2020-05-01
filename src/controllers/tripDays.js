const SortingFunction = {
  [SortType.TIME]: (a, b) => (a.endDate - a.startDate) - (b.endDate - b.startDate),
  [SortType.PRICE]: (a, b) => a.price - b.price,
  [SortType.EVENT]: (a, b) => b.randomWaypointItem - a.randomWaypointItem,
};

const mainTripEventsElement = document.querySelector(`.trip-events`);

import TripCardController from './tripCards.js';
import MainSortTripComponent, {SortType} from '../components/create-site-maintContent-filter-sort.js';
import MainNumberDayComponent from '../components/create-site-maintContent-day.js';
import MainListWaypointComponent from '../components/create-site-maintContent-listWaypoint.js';

import {renderTemplate, RenderPosition} from '../utils/render.js';

import {generateSortOptions} from '../mock/sortOption.js';

const sortOptions = generateSortOptions();

const renderTripCards = (cardsSort, container, day, onDataChange, onViewChange) => {
  return cardsSort.map((countCard) => {
    const tripCardController = new TripCardController(container, onDataChange, onViewChange);
    if (countCard.startDate.toDateString() === day) {
      tripCardController.renderTripCard(countCard);
    }
    return tripCardController;
  });
};

const getSortedCards = (cards, sortType) => {
  let sortedCards = [];
  const showingCards = cards.slice();

  sortedCards = showingCards.sort(SortingFunction[sortType]);

  return sortedCards;
};

export default class TripDaysController {

  constructor(container) {
    this._container = container;

    this._cardsTrip = [];
    this._daysTrip = [];
    this._showedCardControllers = [];

    this._sortComponent = new MainSortTripComponent(sortOptions);
    this._numberDayComponent = null;
    this._listWaypointComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  renderDays(cardsTrip) {

    this._cardsTrip = cardsTrip;

    this._daysTrip = [...new Set(this._cardsTrip.map((card) => card.startDate.toDateString()))];

    const mainTripDaysListElement = this._container.getElement();

    this._sortComponent.getElement().remove();
    renderTemplate(mainTripEventsElement, this._sortComponent, RenderPosition.AFTERBEGIN);

    this._renderTripDays(mainTripDaysListElement, this._cardsTrip);
  }

  _renderTripDays(container, tripCards) {
    this._daysTrip.forEach((day, index) => {
      this._numberDayComponent = new MainNumberDayComponent(day, index);
      this._listWaypointComponent = new MainListWaypointComponent();

      renderTemplate(container, this._numberDayComponent, RenderPosition.BEFOREEND);

      renderTemplate(this._numberDayComponent.getElement(), this._listWaypointComponent, RenderPosition.BEFOREEND);

      const newCards = renderTripCards(tripCards, this._listWaypointComponent.getElement(), day, this._onDataChange, this._onViewChange);
      this._showedCardControllers = this._showedCardControllers.concat(newCards);
    });
  }

  _onDataChange(cardController, oldData, newData) {
    const index = this._cardsTrip.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cardsTrip = [].concat(this._cardsTrip.slice(0, index), newData, this._cardsTrip.slice(index + 1));

    cardController.renderTripCard(this._cardsTrip[index]);
  }

  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const mainTripDaysListElement = this._container.getElement();
    const sortedCards = getSortedCards(this._cardsTrip, sortType);

    this._sortComponent.getElement().remove();
    renderTemplate(mainTripEventsElement, this._sortComponent, RenderPosition.AFTERBEGIN);

    mainTripDaysListElement.innerHTML = ``;

    const newCards = this._renderTripDays(mainTripDaysListElement, sortedCards);
    this._showedCardController = newCards;
  }
}
