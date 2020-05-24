import moment from "moment";
import AbstractComponent from './abstract-component.js';

import {getDuration} from '../utils/common.js';

import {TypeOfWaypoint} from '../constants.js';

const START_OFFERS = 0;
const COUNT_OFFERS = 3;

const createRepeatingOffersMarkup = (options) => {
  return options.slice(START_OFFERS, COUNT_OFFERS).map((option) => {
    const {title, price} = option;
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
       </li>`
    );
  }).join(`\n \n`);
};

const createWaypointItemTemplate = (card) => {
  const {city, startDate, endDate, offer, price, randomWaypointItem} = card;

  const replaceInTo = TypeOfWaypoint.ACTIVITYS.includes(randomWaypointItem);

  const repeatingOffersMarkup = createRepeatingOffersMarkup(offer);
  const eventDuration = getDuration(startDate, endDate);

  return (
    `<li class="trip-events__item">
      <div class="event">

        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${randomWaypointItem.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${randomWaypointItem} ${replaceInTo ? `in` : `to`} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="">${moment(startDate).format(`HH:mm`)}</time>
            &mdash;
            <time class="event__end-time" datetime="">${moment(endDate).format(`HH:mm`)}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${repeatingOffersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class WaypointItem extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createWaypointItemTemplate(this._cards);
  }

  setBtnClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
