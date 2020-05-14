const headerElement = document.querySelector(`.page-header`);
const headerTripMainElement = headerElement.querySelector(`.trip-main`);
const headerTripControlsElement = headerElement.querySelector(`.trip-controls`);
const pageBodyContainer = document.querySelector('.page-body__page-main .page-body__container');
const mainTripEventsElement = pageBodyContainer.querySelector(`.trip-events`);

import CardsModel from './model/event-card-model.js';
import TripDaysController from './controllers/tripDays.js';
import FilterController from './controllers/filterCards.js';

import InfoContainerComponent from './components/create-site-header-containerInfo.js';
import HeaderInfoTripComponent from './components/create-site-header-trip-info.js';
import HeaderCostTripComponent from './components/create-site-header-trip-cost.js';
import HeaderSiteMenuComponent, {MenuItem} from './components/create-site-header-trip-menu.js';

import MainNoPointsComponent from './components/create-site-maintContent-no-points.js';
import MainTripDaysListComponent from './components/create-site-maintContent-listDay.js';

import StatisticsSiteComponent from './components/create-site-maintContent-statistics.js';

import {renderTemplate, RenderPosition} from './utils/render.js';
import {generateCards} from './mock/events.js';
import {TRIP_COUNT} from './utils/common.js';

const cards = generateCards(TRIP_COUNT);
const cardsModel = new CardsModel();
cardsModel.setCards(cards);
const siteMenuComponent = new HeaderSiteMenuComponent();
const tripDaysListComponent = new MainTripDaysListComponent();
const statisticsSiteComponent = new StatisticsSiteComponent(cardsModel);

const filterController = new FilterController(headerTripControlsElement, cardsModel);
const tripDaysController = new TripDaysController(tripDaysListComponent, cardsModel);

const getBasicBlock = () => {
  renderTemplate(headerTripMainElement, new InfoContainerComponent(), RenderPosition.AFTERBEGIN);
};

const getHeaderSite = () => {
  const headerTripInfoElement = headerElement.querySelector(`.trip-info`);

  renderTemplate(headerTripInfoElement, new HeaderInfoTripComponent(), RenderPosition.BEFOREEND);
  renderTemplate(headerTripInfoElement, new HeaderCostTripComponent(), RenderPosition.BEFOREEND);

  renderTemplate(headerTripControlsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);

  filterController.renderFilter();
};

const getMainContentSite = () => {
  if (!cards.length) {
    renderTemplate(mainTripEventsElement, new MainNoPointsComponent(), RenderPosition.BEFOREEND);
  } else {
    renderTemplate(mainTripEventsElement, tripDaysListComponent, RenderPosition.BEFOREEND);
    tripDaysController.renderDays();
  }
  renderTemplate(pageBodyContainer, statisticsSiteComponent, RenderPosition.BEFOREEND);
  // tripDaysController.hide();
  statisticsSiteComponent.hide();
};

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      siteMenuComponent.setActiveItem(MenuItem.TABLE);
      tripDaysController.show();
      statisticsSiteComponent.hide();
      break;
    case MenuItem.STATISTICS:
      siteMenuComponent.setActiveItem(MenuItem.STATISTICS);
      tripDaysController.hide();
      statisticsSiteComponent.show();
      break;
  }
});

getBasicBlock();
getHeaderSite();
getMainContentSite();
