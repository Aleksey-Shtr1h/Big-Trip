const TRIP_COUNT = 12;
const headerElement = document.querySelector(`.page-header`);
const headerTripMainElement = headerElement.querySelector(`.trip-main`);
const headerTripControlsElement = headerElement.querySelector(`.trip-controls`);
const mainTripEventsElement = document.querySelector(`.trip-events`);


import InfoContainerComponent from './components/create-site-header-containerInfo.js';
import HeaderInfoTripComponent from './components/create-site-header-trip-info.js';
import HeaderCostTripComponent from './components/create-site-header-trip-cost.js';
import HeaderSiteMenuComponent from './components/create-site-header-trip-menu.js';
import HeaderFilterComponent from './components/create-site-header-trip-filter.js';

import MainTripDaysListComponent from './components/create-site-maintContent-listDay.js';
import MainSortTripComponent from './components/create-site-maintContent-filter-sort.js';
import MainNumberDayComponent from './components/create-site-maintContent-day.js';
import MainListWaypointComponent from './components/create-site-maintContent-listWaypoint.js';
import MainEditFormComponent from './components/create-site-maintContent-edit-form.js';
import MainWaypointItemComponent from './components/create-site-maintContent-waypoint.js';

import {renderTemplate, RenderPosition, getRandomIntegerNumber} from './utils.js';
import {generateFilters} from './mock/filter.js';
import {generateCards} from './mock/events.js';

const getBasicBlock = () => {
  renderTemplate(headerTripMainElement, new InfoContainerComponent().getElement(), RenderPosition.AFTERBEGIN);
};

const getHeaderSite = () => {
  const headerTripInfoElement = headerElement.querySelector(`.trip-info`);
  const filters = generateFilters();

  renderTemplate(headerTripInfoElement, new HeaderInfoTripComponent().getElement(), RenderPosition.BEFOREEND);
  renderTemplate(headerTripInfoElement, new HeaderCostTripComponent().getElement(), RenderPosition.BEFOREEND);
  renderTemplate(headerTripControlsElement, new HeaderSiteMenuComponent().getElement(), RenderPosition.AFTERBEGIN);
  renderTemplate(headerTripControlsElement, new HeaderFilterComponent(filters).getElement(), RenderPosition.BEFOREEND);
};

const getMainContentSite = () => {

  const cards = generateCards(TRIP_COUNT);

  const renderTripCard = (cardListElement, countCard) => {
    const onEditButtonClick = () => {
      cardListElement.replaceChild(editFormComponent.getElement(), waypointItemComponent.getElement());
    };

    const onEditFormSubmit = (evt) => {
      evt.preventDefault();
      cardListElement.replaceChild(waypointItemComponent.getElement(), editFormComponent.getElement());
    };

    const waypointItemComponent = new MainWaypointItemComponent(countCard);
    const editEventBtn = waypointItemComponent.getElement().querySelector(`.event__rollup-btn`);
    editEventBtn.addEventListener(`click`, onEditButtonClick);

    const editFormComponent = new MainEditFormComponent(countCard);
    const editEventForm = editFormComponent.getElement().querySelector(`form`);
    editEventForm.addEventListener(`submit`, onEditFormSubmit);

    renderTemplate(cardListElement, waypointItemComponent.getElement(), RenderPosition.BEFOREEND);
  };

  const renderTripDays = (daysListElement, cardsTrip) => {
    const mainTripDaysListElement = daysListElement.getElement();

    cardsTrip.map((card, index) => {
      const tripList = getRandomIntegerNumber(1, 5);

      const numberDay = new MainNumberDayComponent(card, index);
      const mainListWaypoint = new MainListWaypointComponent();

      renderTemplate(mainTripDaysListElement, numberDay.getElement(), RenderPosition.BEFOREEND);

      renderTemplate(numberDay.getElement(), mainListWaypoint.getElement(), RenderPosition.BEFOREEND);

      const mainListWaypointElement = mainListWaypoint.getElement();
      cardsTrip.slice(0, tripList).forEach((countCard) => {
        renderTripCard(mainListWaypointElement, countCard);
      });
    });
  };

  const tripDaysListComponent = new MainTripDaysListComponent();
  renderTemplate(mainTripEventsElement, new MainSortTripComponent().getElement(), RenderPosition.AFTERBEGIN);
  renderTemplate(mainTripEventsElement, tripDaysListComponent.getElement(), RenderPosition.BEFOREEND);
  renderTripDays(tripDaysListComponent, cards);
};

getBasicBlock();
getHeaderSite();
getMainContentSite();
