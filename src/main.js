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
import MainEditFormComponent from './components/create-site-maintContent-edit-form.js';
import MainWaypointItemComponent from './components/create-site-maintContent-waypoint.js';

import {renderTemplate, RenderPosition, getRandomIntegerNumber} from './utils.js';
import {generateFilters} from './mock/filter.js';
import {generateCards} from './mock/events.js';

const getBasicBlock = () => {
  renderTemplate(headerTripMainElement, new InfoContainerComponent().getElement(), RenderPosition.AFTERBEGIN);
  renderTemplate(mainTripEventsElement, new MainTripDaysListComponent().getElement(), RenderPosition.BEFOREEND);
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
  const mainTripDaysItemElement = document.querySelector(`.trip-days`);

  const cards = generateCards(TRIP_COUNT);
  renderTemplate(mainTripEventsElement, new MainSortTripComponent().getElement(), RenderPosition.AFTERBEGIN);

  cards.map((card, index) => {
    const tripList = getRandomIntegerNumber(3, 5);

    renderTemplate(mainTripDaysItemElement, new MainNumberDayComponent(card, index).getElement(), RenderPosition.BEFOREEND);

    const mainTripEventsListElement = mainTripEventsElement.querySelector(`.trip-events__list--${index}`);

    if (index === 0) {
      renderTemplate(mainTripEventsListElement, new MainEditFormComponent(card).getElement(), RenderPosition.BEFOREEND);
    }

    cards.slice(1, tripList)
    .forEach((count) => renderTemplate(mainTripEventsListElement, new MainWaypointItemComponent(count).getElement(), RenderPosition.BEFOREEND));
  });
};

getBasicBlock();
getHeaderSite();
getMainContentSite();
