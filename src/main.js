const TRIP_COUNT = 3;
const headerElement = document.querySelector(`.page-header`);
const headerTripMainElement = headerElement.querySelector(`.trip-main`);
const headerTripControlsElement = headerElement.querySelector(`.trip-controls`);
const mainTripEventsElement = document.querySelector(`.trip-events`);

import {createInfoContainerTemplate, createTripDaysList} from './components/create-site-basic-block.js';
import {createInfoTripTemplate} from './components/create-site-header-trip-info.js';
import {createCostTripTemplate} from './components/create-site-header-trip-cost.js';
import {createMenuTripTemplate} from './components/create-site-header-trip-menu.js';
import {createFilterTripTemplate} from './components/create-site-header-trip-filter.js';
import {createSortTripTemplate} from './components/create-site-maintContent-filter-sort.js';
import {createEditFormItemTemplate} from './components/create-site-maintContent-edit-form.js';
import {createWaypointItemTemplate} from './components/create-site-maintContent-waypoint.js';

const renderTemplate = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const getBasicBlock = () => {
  renderTemplate(headerTripMainElement, createInfoContainerTemplate(), `afterbegin`);
  renderTemplate(mainTripEventsElement, createTripDaysList());
};

const getHeaderSite = () => {
  const headerTripInfoElement = headerElement.querySelector(`.trip-info`);
  renderTemplate(headerTripInfoElement, createInfoTripTemplate());
  renderTemplate(headerTripInfoElement, createCostTripTemplate());
  renderTemplate(headerTripControlsElement, createMenuTripTemplate(), `afterbegin`);
  renderTemplate(headerTripControlsElement, createFilterTripTemplate());
};

const getMainContentSite = () => {
  const mainTripEventsListElement = mainTripEventsElement.querySelector(`.trip-events__list`);
  renderTemplate(mainTripEventsElement, createSortTripTemplate(), `afterbegin`);
  renderTemplate(mainTripEventsListElement, createEditFormItemTemplate());
  for (let i = 0; i < TRIP_COUNT; i++) {
    renderTemplate(mainTripEventsListElement, createWaypointItemTemplate());
  }
};

getBasicBlock();
getHeaderSite();
getMainContentSite();
