import API from './api.js';

import CardsModel from './model/event-card-model.js';
import TripDaysController from './controllers/tripDays.js';
import FilterController from './controllers/filterCards.js';

import InfoContainerComponent from './components/create-site-header-containerInfo.js';
// import HeaderInfoTripComponent from './components/create-site-header-trip-info.js';
// import HeaderCostTripComponent from './components/create-site-header-trip-cost.js';
import HeaderSiteMenuComponent, {MenuItem} from './components/create-site-header-trip-menu.js';

import MainNoPointsComponent from './components/create-site-maintContent-no-points.js';
import MainTripDaysListComponent from './components/create-site-maintContent-listDay.js';

import StatisticsSiteComponent from './components/create-site-maintContent-statistics.js';

import {renderTemplate, RenderPosition} from './utils/render.js';

const headerElement = document.querySelector(`.page-header`);
const headerTripMainElement = headerElement.querySelector(`.trip-main`);
const headerTripControlsElement = headerElement.querySelector(`.trip-controls`);
const pageBodyContainer = document.querySelector(`.page-body__page-main .page-body__container`);
const mainTripEventsElement = pageBodyContainer.querySelector(`.trip-events`);

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);
const cardsModel = new CardsModel();

const siteMenuComponent = new HeaderSiteMenuComponent();

// const infoComponent = new HeaderInfoTripComponent(cardsModel);
// const costTripComponent = new HeaderCostTripComponent();

const tripDaysListComponent = new MainTripDaysListComponent();
const statisticsSiteComponent = new StatisticsSiteComponent(cardsModel);

const filterController = new FilterController(headerTripControlsElement, cardsModel);
const tripDaysController = new TripDaysController(tripDaysListComponent, cardsModel, api);

api.getData()
  .then((cards) => {
    cardsModel.setCards(cards);

    renderTemplate(headerTripMainElement, new InfoContainerComponent(), RenderPosition.AFTERBEGIN);

    // const headerTripInfoElement = headerElement.querySelector(`.trip-info`);

    // renderTemplate(headerTripInfoElement, new HeaderInfoTripComponent(cardsModel), RenderPosition.BEFOREEND);
    // renderTemplate(headerTripInfoElement, costTripComponent, RenderPosition.BEFOREEND);

    renderTemplate(headerTripControlsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);

    filterController.renderFilter();

    if (!cards.length) {
      renderTemplate(mainTripEventsElement, tripDaysListComponent, RenderPosition.BEFOREEND);
      renderTemplate(mainTripEventsElement, new MainNoPointsComponent(), RenderPosition.BEFOREEND);
      tripDaysController.renderDays();
    } else {
      renderTemplate(mainTripEventsElement, tripDaysListComponent, RenderPosition.BEFOREEND);
      tripDaysController.renderDays();
    }
    renderTemplate(pageBodyContainer, statisticsSiteComponent, RenderPosition.BEFOREEND);
    statisticsSiteComponent.hide();
  });


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
