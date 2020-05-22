import {FilterSortType} from '../constants.js';

import TripCardController, {Modes as CardControllerModes, EmptyCard} from './tripCards.js';
import MainSortTripComponent, {SortType} from '../components/create-site-maintContent-filter-sort.js';
import MainNumberDayComponent from '../components/create-site-maintContent-day.js';
import MainListWaypointComponent from '../components/create-site-maintContent-listWaypoint.js';

import {renderTemplate, RenderPosition, remove, raplaceElement} from '../utils/render.js';

const SortingFunction = {
  [SortType.TIME]: (a, b) => (a.endDate - a.startDate) - (b.endDate - b.startDate),
  [SortType.PRICE]: (a, b) => a.price - b.price,
  [SortType.EVENT]: (a, b) => b.randomWaypointItem - a.randomWaypointItem,
};

const mainTripEventsElement = document.querySelector(`.trip-events`);


const renderTripCards = (card, count, container, onDataChange, onViewChange) => {
  const tripCardController = new TripCardController(container, onDataChange, onViewChange);
  tripCardController.renderTripCard(card, count + 1, CardControllerModes.DEFAULT);
  return tripCardController;
};


const getSortedCards = (cards, sortType) => {
  let sortedCards = [];
  const showingCards = cards.slice();
  sortedCards = showingCards.sort(SortingFunction[sortType]);

  return sortedCards;
};

export default class TripDaysController {

  constructor(container, cardsModel, api) {
    this._container = container;
    this._cardsModel = cardsModel;
    this._api = api;

    this._newEventBtn = document.querySelector(`.trip-main__event-add-btn`);

    this._daysTrip = [];
    this._showedDay = [];
    this._showedCardControllers = [];

    this._activeSortType = FilterSortType.EVENT;
    // this._sortComponent = new MainSortTripComponent(sortOptions);
    this._sortComponent = null;

    this._numberDayComponent = null;
    this._listWaypointComponent = null;
    this._creatingCard = null;
    this._sortType = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    // this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._cardsModel.setFilterChangeHandler(this._onFilterChange);
    this._cardsModel.setFilterBtnClickChangeHandlers(this._onFilterChange);
  }

  renderDays() {

    const cardsTrip = this._cardsModel.getCards();


    this._daysTrip = [...new Set(cardsTrip
      .sort((prev, next) => prev.startDate - next.startDate)
      .map((card) => card.startDate.toDateString()))];

    const mainTripDaysListElement = this._container.getElement();

    this._newEvent();
    this._renderTripDays(mainTripDaysListElement, cardsTrip);
  }

  _renderTripDays(container, tripCards) {
    this.getFilterSort();
    this._daysTrip.forEach((day, index) => {

      this._numberDayComponent = new MainNumberDayComponent(day, index);

      this._listWaypointComponent = new MainListWaypointComponent();

      this._showedDay.push(this._numberDayComponent);

      tripCards.map((card, count) => {
        if (card.startDate.toDateString() === day) {

          renderTemplate(container, this._numberDayComponent, RenderPosition.BEFOREEND);

          renderTemplate(this._numberDayComponent.getElement(), this._listWaypointComponent, RenderPosition.BEFOREEND);

          const newCards = renderTripCards(card, count, this._listWaypointComponent.getElement(), this._onDataChange, this._onViewChange);
          this._showedCardControllers = this._showedCardControllers.concat(newCards);
        }
      });
    });
  }

  _updateCards(filterRender = true) {
    const mainTripDaysListElement = this._container.getElement();
    this._removeDay();
    this._removeCards();
    if (filterRender) {
      this.renderDays();
    }
    this._renderTripDays(mainTripDaysListElement, this._cardsModel.getCards());
    this._newEventBtn.removeAttribute(`disabled`);
  }

  _removeCards() {
    if (this._creatingCard) {
      this._creatingCard = null;
    }
    this._showedCardControllers.forEach((cardController) => cardController.destroy());
    this._showedCardControllers = [];
  }

  _removeDay() {
    this._showedDay.forEach((dayComponent) => remove(dayComponent));
    this._showedDay = [];
  }

  _onDataChange(cardController, oldData, newData) {

    if (oldData === EmptyCard) {
      if (newData === null) {
        cardController.destroy();
        this._creatingCard = null;
        this._newEventBtn.disabled = false;
        // this._updateCards();
      } else {
        this._api.createCard(newData)
          .then((cardModel) => {

            this._cardsModel.addCards(cardModel);

            cardController.renderTripCard(cardModel, -1, CardControllerModes.DEFAULT);

            const destroyedCards = this._showedCardControllers.pop();
            destroyedCards.destroy();

            this._showedCardControllers = [].concat(cardController, this._showedCardControllers);
            this._updateCards();
            // this._newEventBtn.removeAttribute("disabled");
          })
          .catch(() => {
            cardController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deleteCard(oldData.id)
      .then(() => {
        this._cardsModel.removeCards(oldData.id);
        this._updateCards();
      })
      .catch(() => {
        cardController.shake();
      });
    } else {
      this._api.updateCard(oldData.id, newData)
        .then((cardModel) => {
          const isSuccess = this._cardsModel.updateCards(oldData.id, cardModel);

          if (isSuccess) {
            cardController.renderTripCard(cardModel, -1, CardControllerModes.DEFAULT);
          }
        })
        .catch(() => {
          cardController.shake();
        });
    }
  }

  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const mainTripDaysListElement = this._container.getElement();
    this._activeSortType = sortType;
    const sortedCards = getSortedCards(this._cardsModel.getCards(), sortType);

    this._removeCards();
    this._removeDay();
    this._renderTripDays(mainTripDaysListElement, sortedCards);
  }

  _onFilterChange() {
    this._updateCards(false);
  }

  _newEvent() {
    // const newEventBtn = document.querySelector(`.trip-main__event-add-btn`);
    // this._newEventBtn.removeEventListener(`click`, () => {
    //   this.createCard();
    // });
    this._newEventBtn.addEventListener(`click`, () => {
      this.createCard();
      this._newEventBtn.disabled = true;
    });
  }

  createCard() {
    if (this._creatingCard) {
      return;
    }

    this._creatingCard = new TripCardController(this._container.getElement(), this._onDataChange, this._onViewChange);

    this._creatingCard.renderTripCard(EmptyCard, -2, CardControllerModes.ADDING);

    this._showedCardControllers = [].concat(this._creatingCard);

    this._activeSortType = SortType.EVENT;
    this.getFilterSort();
  }

  getFilterSort() {
    const filterSort = Object.values(FilterSortType).map((sortType) => {
      return {
        name: sortType,
        checked: sortType === this._activeSortType,
      };
    });

    const oldComponent = this._sortComponent;
    this._sortComponent = new MainSortTripComponent(filterSort);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    this._sortComponent.getElement().remove();
    this._newEventBtn.disabled = false;
    if (oldComponent) {
      raplaceElement(this._sortComponent, oldComponent);
    } else {
      renderTemplate(mainTripEventsElement, this._sortComponent, RenderPosition.AFTERBEGIN);
    }
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }
}
