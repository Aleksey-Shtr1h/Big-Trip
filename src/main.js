const TRIP_DAYS = [1, 2, 3, 4, 5, 6, 8];
const TRIP_COUNT = 4;

const headerElement = document.querySelector(`.page-header`);
const headerTripMainElement = headerElement.querySelector(`.trip-main`);
const headerTripControlsElement = headerElement.querySelector(`.trip-controls`);
const mainTripEventsElement = document.querySelector(`.trip-events`);

import TripDaysController from './controllers/tripDays.js';

import InfoContainerComponent from './components/create-site-header-containerInfo.js';
import HeaderInfoTripComponent from './components/create-site-header-trip-info.js';
import HeaderCostTripComponent from './components/create-site-header-trip-cost.js';
import HeaderSiteMenuComponent from './components/create-site-header-trip-menu.js';
import HeaderFilterComponent from './components/create-site-header-trip-filter.js';

import MainNoPointsComponent from './components/create-site-maintContent-no-points.js';
import MainTripDaysListComponent from './components/create-site-maintContent-listDay.js';
// import MainSortTripComponent from './components/create-site-maintContent-filter-sort.js';

import {renderTemplate, RenderPosition} from './utils/render.js';
import {generateFilters} from './mock/filter.js';
import {generateCards} from './mock/events.js';

const getBasicBlock = () => {
  renderTemplate(headerTripMainElement, new InfoContainerComponent(), RenderPosition.AFTERBEGIN);
};

const getHeaderSite = () => {
  const headerTripInfoElement = headerElement.querySelector(`.trip-info`);
  const filters = generateFilters();

  renderTemplate(headerTripInfoElement, new HeaderInfoTripComponent(), RenderPosition.BEFOREEND);
  renderTemplate(headerTripInfoElement, new HeaderCostTripComponent(), RenderPosition.BEFOREEND);
  renderTemplate(headerTripControlsElement, new HeaderSiteMenuComponent(), RenderPosition.AFTERBEGIN);
  renderTemplate(headerTripControlsElement, new HeaderFilterComponent(filters), RenderPosition.BEFOREEND);
};

const getMainContentSite = () => {
  const days = TRIP_DAYS;
  const cards = generateCards(TRIP_COUNT);

  const tripDaysListComponent = new MainTripDaysListComponent();
  const tripDaysController = new TripDaysController(tripDaysListComponent);

  if (!cards.length) {
    renderTemplate(mainTripEventsElement, new MainNoPointsComponent(), RenderPosition.BEFOREEND);
  } else {
    renderTemplate(mainTripEventsElement, tripDaysListComponent, RenderPosition.BEFOREEND);
    tripDaysController.renderDays(days, cards);
  }
};

getBasicBlock();
getHeaderSite();
getMainContentSite();
