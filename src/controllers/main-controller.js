import API from '../api.js';

import CardsModel from '../model/event-card-model.js';
import TripDaysController from '../controllers/trip-days-controller.js';
import FilterCardsController from '../controllers/filter-cards-controller.js';

import ContainerInfoComponent from '../components/create-site-header-container-info.js';
import HeaderInfoTripComponent from '../components/create-site-header-trip-info.js';
import HeaderCostTripComponent from '../components/create-site-header-trip-cost.js';
import HeaderSiteMenuComponent, {MenuItem} from '../components/create-site-header-trip-menu.js';

import MainNoPointsComponent from '../components/create-site-main-content-no-points.js';
import MainTripDaysListComponent from '../components/create-site-main-content-list-day.js';
import StatisticsSiteComponent from '../components/create-site-main-content-statistics.js';

import {renderTemplate, RenderPosition, remove} from '../utils/render.js';

const headerElement = document.querySelector(`.page-header`);
const headerTripMainElement = headerElement.querySelector(`.trip-main`);
const headerTripControlsElement = headerElement.querySelector(`.trip-controls`);
const pageBodyContainerElement = document.querySelector(`.page-body__page-main .page-body__container`);
const mainTripEventsElement = pageBodyContainerElement.querySelector(`.trip-events`);

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

export default class MainController {
  constructor() {
    this._api = new API(END_POINT, AUTHORIZATION);
    this._cardsModel = new CardsModel();

    this._siteMenuComponent = new HeaderSiteMenuComponent();
    this._tripDaysListComponent = new MainTripDaysListComponent();
    this._statisticsSiteComponent = new StatisticsSiteComponent(this._cardsModel);
    this._noPointsComponent = new MainNoPointsComponent();

    this._filterCardsController = new FilterCardsController(headerTripControlsElement, this._cardsModel);
    this._tripDaysController = new TripDaysController(this._tripDaysListComponent, this._cardsModel, this._api);

    this._changePriceHandler = this._changePriceHandler.bind(this);
    this._tripDaysController.setPriceChangeHandler(this._changePriceHandler);
  }

  renderMainController() {
    renderTemplate(headerTripMainElement, new ContainerInfoComponent(), RenderPosition.AFTERBEGIN);

    renderTemplate(headerTripControlsElement, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
    this._navigationControl();

    this._api.getData()
    .then((cards) => {
      this._cardsModel.setCards(cards);
      this._filterCardsController.renderFilter();
      this._changePriceHandler();

      renderTemplate(mainTripEventsElement, this._tripDaysListComponent, RenderPosition.BEFOREEND);
      this._tripDaysController.renderDays();

      renderTemplate(pageBodyContainerElement, this._statisticsSiteComponent, RenderPosition.BEFOREEND);
      this._statisticsSiteComponent.hide();
    });
  }

  _navigationControl() {
    this._siteMenuComponent.setOnChange((menuItem) => {
      switch (menuItem) {
        case MenuItem.TABLE:
          this._siteMenuComponent.setActiveItem(MenuItem.TABLE);
          this._tripDaysController.show();
          this._statisticsSiteComponent.hide();
          break;
        case MenuItem.STATISTICS:
          this._siteMenuComponent.setActiveItem(MenuItem.STATISTICS);
          this._tripDaysController.hide();
          this._statisticsSiteComponent.show();
          break;
      }
    });
  }

  _renderInfo(container) {
    renderTemplate(container, this._infoComponent, RenderPosition.BEFOREEND);
    renderTemplate(container, this._costTripComponent, RenderPosition.BEFOREEND);
  }

  _changePriceHandler() {
    const headerTripInfoElement = headerElement.querySelector(`.trip-info`);
    if (this._costTripComponent || this._infoComponent) {
      remove(this._infoComponent);
      remove(this._costTripComponent);
    }

    this._costTripComponent = new HeaderCostTripComponent(this._tripDaysController.setInfo());
    this._infoComponent = new HeaderInfoTripComponent(this._tripDaysController.setInfo());
    this._renderInfo(headerTripInfoElement);
  }
}
