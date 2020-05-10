const headerElement = document.querySelector(`.page-header`);
const headerTripMainElement = headerElement.querySelector(`.trip-main`);
const headerTripControlsElement = headerElement.querySelector(`.trip-controls`);
const mainTripEventsElement = document.querySelector(`.trip-events`);

import CardsModel from './model/event-card-model.js';
import TripDaysController from './controllers/tripDays.js';
import FilterController from './controllers/filterCards.js';

import InfoContainerComponent from './components/create-site-header-containerInfo.js';
import HeaderInfoTripComponent from './components/create-site-header-trip-info.js';
import HeaderCostTripComponent from './components/create-site-header-trip-cost.js';
import HeaderSiteMenuComponent from './components/create-site-header-trip-menu.js';

import MainNoPointsComponent from './components/create-site-maintContent-no-points.js';
import MainTripDaysListComponent from './components/create-site-maintContent-listDay.js';

import {renderTemplate, RenderPosition} from './utils/render.js';
import {generateCards} from './mock/events.js';
import {TRIP_COUNT} from './utils/common.js';

const cards = generateCards(TRIP_COUNT);
const cardsModel = new CardsModel();
cardsModel.setCards(cards);

const getBasicBlock = () => {
  renderTemplate(headerTripMainElement, new InfoContainerComponent(), RenderPosition.AFTERBEGIN);
};

const getHeaderSite = () => {
  const headerTripInfoElement = headerElement.querySelector(`.trip-info`);

  renderTemplate(headerTripInfoElement, new HeaderInfoTripComponent(), RenderPosition.BEFOREEND);
  renderTemplate(headerTripInfoElement, new HeaderCostTripComponent(), RenderPosition.BEFOREEND);
  renderTemplate(headerTripControlsElement, new HeaderSiteMenuComponent(), RenderPosition.AFTERBEGIN);
  const filterController = new FilterController(headerTripControlsElement, cardsModel);
  filterController.renderFilter();
};

const getMainContentSite = () => {

  const tripDaysListComponent = new MainTripDaysListComponent();
  const tripDaysController = new TripDaysController(tripDaysListComponent, cardsModel);

  if (!cards.length) {
    renderTemplate(mainTripEventsElement, new MainNoPointsComponent(), RenderPosition.BEFOREEND);
  } else {
    renderTemplate(mainTripEventsElement, tripDaysListComponent, RenderPosition.BEFOREEND);
    tripDaysController.renderDays();
  }
};

getBasicBlock();
getHeaderSite();
getMainContentSite();
