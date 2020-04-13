const TRIP_COUNT = 12;
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
import {createDayTemplate} from './components/create-site-maintContent-day.js';
import {createEditFormItemTemplate} from './components/create-site-maintContent-edit-form.js';
import {createWaypointItemTemplate} from './components/create-site-maintContent-waypoint.js';

import {generateFilters} from './mock/filter.js';
import {generateCards} from './mock/events.js';

const renderTemplate = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const getBasicBlock = () => {
  renderTemplate(headerTripMainElement, createInfoContainerTemplate(), `afterbegin`);
  renderTemplate(mainTripEventsElement, createTripDaysList());
};

const getHeaderSite = () => {
  const filters = generateFilters();

  const headerTripInfoElement = headerElement.querySelector(`.trip-info`);
  renderTemplate(headerTripInfoElement, createInfoTripTemplate());
  renderTemplate(headerTripInfoElement, createCostTripTemplate());
  renderTemplate(headerTripControlsElement, createMenuTripTemplate(), `afterbegin`);
  renderTemplate(headerTripControlsElement, createFilterTripTemplate(filters));
};

const getMainContentSite = () => {
  const cards = generateCards(TRIP_COUNT);
  const mainTripDaysItemElement = document.querySelector(`.trip-days`);

  renderTemplate(mainTripEventsElement, createSortTripTemplate(), `afterbegin`);

  cards.map((card, index) => {
    const minTripList = 3;
    const maxTripList = 6;
    const tripList = minTripList + Math.floor(Math.random() * (maxTripList - minTripList));
    renderTemplate(mainTripDaysItemElement, createDayTemplate(card, index));
    const mainTripEventsListElement = mainTripEventsElement.querySelector(`.trip-events__list--${index}`);

    if (index === 0) {
      renderTemplate(mainTripEventsListElement, createEditFormItemTemplate(card, index));
    }

    cards.slice(1, tripList)
    .forEach((count) => renderTemplate(mainTripEventsListElement, createWaypointItemTemplate(count)));
  });
};

getBasicBlock();
getHeaderSite();
getMainContentSite();
