import {formatTime, formatDate} from '../utils/common.js';
import {CITIES, getOffers} from '../mock/events.js';
import AbstractSmartComponent from './abstract-smart-component.js';

const createFavoriteBtnMarkup = (name, isActive = true) => {
  return (
    `<input
      id="event-${name}-1"
      class="event__${name}-checkbox  visually-hidden"
      type="checkbox"
      name="event-${name}"
      ${isActive ? `checked` : ``}>

    <label class="event__${name}-btn" for="event-${name}-1">
      <span class="visually-hidden">Add to ${name}</span>
      <svg class="event__${name}-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const createRepeatingOffersMarkup = (options) => {
  return options.map((option, index) => {
    const {type, name, price} = option;
    const isChecked = (index === 0) ? true : false;
    return (
      `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${type}-1" type="checkbox"
          name="event-offer-${type}"
          ${isChecked ? `checked` : ``}>
        <label
          class="event__offer-label"
          for="event-offer-${type}-1">
          <span class="event__offer-title">${name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join(`\n \n`);
};

const createRepeatingTransferMarkup = (typeOfWaypoints, randomItem) => {

  const result = typeOfWaypoints.map((wayPoint) => {
    const isChecked = (randomItem === wayPoint) ? true : false;
    const lowerCaseItem = wayPoint.toLowerCase();
    return (
      `<div class="event__type-item">
        <input
          id="event-type-${lowerCaseItem}-1"
          class="event__type-input  visually-hidden" type="radio"
          name="event-type"
          value="${lowerCaseItem}"
          ${isChecked ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${lowerCaseItem}" for="event-type-${lowerCaseItem}-1">${wayPoint}</label>
      </div>`
    );
  }).join(`\n \n`);

  return result;
};

const createRepeatingActivityMarkup = (typeOfWaypoints, randomItem) => {

  const result = typeOfWaypoints.map((wayPoint) => {
    const isChecked = (randomItem === wayPoint) ? true : false;
    const lowerCaseItem = wayPoint.toLowerCase();
    return (
      `<div class="event__type-item">
        <input
          id="event-type-${lowerCaseItem}-1"
          class="event__type-input  visually-hidden" type="radio"
          name="event-type"
          value="${lowerCaseItem}"
          ${isChecked ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${lowerCaseItem}" for="event-type-${lowerCaseItem}-1">${wayPoint}</label>
      </div>`
    );
  }).join(`\n \n`);

  return result;
};

const createRepeatingPhotoMarkup = (counts) => {
  const result = counts.map((count) => {
    return (
      `<img class="event__photo" src="img/photos/${count}.jpg" alt="Event photo">`
    );
  }).join(`\n \n`);

  return result;
};


const createEditFormTemplate = (card) => {
  const {city, typeOfWaypoints, description, startDate, endDate, offer, price, photosCount, randomWaypointItem} = card;

  const isDateShowing = !!startDate;

  const time = isDateShowing ? formatTime(startDate) : ``;
  const date = isDateShowing ? formatDate(startDate) : ``;

  const nextTime = isDateShowing ? formatTime(endDate) : ``;
  const nextDate = isDateShowing ? formatDate(endDate) : ``;

  const favoritesButton = createFavoriteBtnMarkup(`favorite`, card.isFavorite);

  const repeatingOffersMarkup = createRepeatingOffersMarkup(offer);

  const repeatingTransfersMarkup = createRepeatingTransferMarkup(typeOfWaypoints.transfers, randomWaypointItem);

  const repeatingActivityMarkup = createRepeatingActivityMarkup(typeOfWaypoints.activitys, randomWaypointItem);
  const repeatingPhotoMarkup = createRepeatingPhotoMarkup(photosCount);


  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${randomWaypointItem}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${repeatingTransfersMarkup}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${repeatingActivityMarkup}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${randomWaypointItem} to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1"
              type="text" name="event-destination"
              value="${city}"
              list="destination-list-1">
            <datalist id="destination-list-1">
              ${CITIES.map((it) =>`<option value="${it}"></option>`).join(`\n \n`)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${date} ${time}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${nextDate} ${nextTime}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          ${favoritesButton}

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">

          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${repeatingOffersMarkup}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${repeatingPhotoMarkup}
              </div>
            </div>
          </section>

        </section>

      </form>
    </li>`
  );
};

export default class EditForm extends AbstractSmartComponent {
  constructor(cards) {
    super();
    this._cards = cards;
    this._typeOfWaypoints = cards.typeOfWaypoints.wayPointsAll;
    this._offer = cards.offer;
    this._city = cards.city;
    this._description = cards.description;
    this._photos = cards.photos;

    this._submitHandler = null;
    this._favoriteClickHandler = null;
  }

  getTemplate() {
    return createEditFormTemplate(this._cards);
  }

  reset() {
    const cards = this._cards;

    this._type = cards.typeOfWaypoints.wayPointsAll;
    this._city = cards.city;
    this._offer = cards.offer;
    this._description = cards.description;
    this._photos = cards.photos;

    this.rerender();
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavoritesInputClickHandler(this._favoriteClickHandler);
    this._subscribeOnEvents();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setFavoritesInputClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-icon`).addEventListener(`click`, handler);
    this._favoriteClickHandler = handler;
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    element.querySelector(`.event__type-list`)
    .addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        this._typeOfWaypoints = evt.target.value;
        this._offer = getOffers();
        this.rerender();
      }
    });
  }
}
