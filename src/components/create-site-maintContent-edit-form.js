// import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';


import {formatDate, getRandomArrayItem, getCapitalizeFirstLetter} from '../utils/common.js';
import {CITIES, getOffers, DESCRIPTION_ITEMS} from '../mock/events.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import "flatpickr/dist/flatpickr.min.css";

import moment from "moment";

const TYPE_OF_WAYPOINTS = {
  transfers: [`Taxi`, `Bus`, `Train`, `Ship`, `Drive`, `Flight`],
  activitys: [`Check-in`, `Sightseeing`, `Restaurant`],
  wayPointsAll: [`Taxi`, `Bus`, `Train`, `Ship`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`],
};

const createFavoriteBtnMarkup = (name, isActive = true, countCard) => {
  return (
    `<input
      id="event-${name}-${countCard}"
      class="event__${name}-checkbox  visually-hidden"
      type="checkbox"
      name="event-${name}"
      ${isActive ? `checked` : ``}>

    <label class="event__${name}-btn" for="event-${name}-${countCard}">
      <span class="visually-hidden">Add to ${name}</span>
      <svg class="event__${name}-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const createRepeatingOffersMarkup = (options, countCard) => {
  return options.map((option, index) => {
    const {title, price} = option;
    const isChecked = true;
    return (
      `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${title}-${index}"
          type="checkbox"
          name="${title}"
          ${isChecked ? `checked` : ``}>
        <label
          class="event__offer-label"
          for="event-offer-${title}-${index}">
          <span class="event__offer-title">${title}</span>
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

const createRepeatingActivityMarkup = (typeOfWaypoints, randomItem, countCard) => {

  const result = typeOfWaypoints.map((wayPoint) => {
    const isChecked = (randomItem === wayPoint) ? true : false;
    const lowerCaseItem = wayPoint.toLowerCase();
    return (
      `<div class="event__type-item">
        <input
          id="event-type-${lowerCaseItem}-${countCard}"
          class="event__type-input  visually-hidden" type="radio"
          name="event-type"
          value="${lowerCaseItem}"
          ${isChecked ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${lowerCaseItem}" for="event-type-${lowerCaseItem}-${countCard}">${wayPoint}</label>
      </div>`
    );
  }).join(`\n \n`);

  return result;
};

const createRepeatingPhotoMarkup = (counts) => {

  const result = counts.map((count) => {
    const {scr} = count;
    return (
      `<img class="event__photo" src="${scr}" alt="Event photo">`
    );
  }).join(`\n \n`);

  return result;
};


const createEditFormTemplate = (card, countCard, attributes = {}) => {
  const {startDate, endDate, price, photosCount} = card;
  const {city, description, offer, isFavorite, randomWaypointItem} = attributes;

  const isDateShowing = !!startDate;

  const favoritesButton = createFavoriteBtnMarkup(`favorite`, isFavorite, countCard);

  const repeatingOffersMarkup = createRepeatingOffersMarkup(offer, countCard);

  const typeUpper = getCapitalizeFirstLetter(randomWaypointItem);
  const isTypeAvailability = typeUpper ? typeUpper : randomWaypointItem;

  const repeatingTransfersMarkup = createRepeatingTransferMarkup(TYPE_OF_WAYPOINTS.transfers, isTypeAvailability);

  const repeatingActivityMarkup = createRepeatingActivityMarkup(TYPE_OF_WAYPOINTS.activitys, isTypeAvailability, countCard);
  const repeatingPhotoMarkup = createRepeatingPhotoMarkup(photosCount);


  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${countCard}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${isTypeAvailability}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${countCard}" type="checkbox">

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
            <label class="event__label  event__type-output" for="event-destination-${countCard}">
              ${isTypeAvailability} to
            </label>
            <select class="event__input  event__input--destination" id="event-destination-${countCard}"
              type="text" name="event-destination"
              value="${city}"
              list="destination-list-${countCard}">
            <datalist id="destination-list-${countCard}">
              ${CITIES.map((it) =>`<option value=${it} ${it === city ? `selected` : ``}>${it}</option>`).join(`\n \n`)}
            </datalist>
            </select>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${countCard}">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-${countCard}" type="text" name="event-start-time" value="${moment(startDate).format(`DD/MM/YY hh:mm`)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${countCard}">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-${countCard}" type="text" name="event-end-time" value="${moment(endDate).format(`DD/MM/YY hh:mm`)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${countCard}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${countCard}" type="number" name="event-price" value="${price}">
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

const parseFormData = (formDate, form) => {
  const picturesAll = [];
  const offersAll = [];
  const picturesElement = form.querySelectorAll(`.event__photo`);
  const divOffers = form.querySelectorAll(`.event__offer-selector`);

  picturesElement.forEach((picture) => {
    picturesAll.push({
      scr: picture.src,
      // alt: picture.alt,
    });
  });

  divOffers.forEach((offer, index) => {
    offersAll.push({
      title: offer.querySelector(`.event__offer-checkbox`).name,
      price: Number(offer.querySelector(`.event__offer-price`).textContent),
    });
  });

  const formUser = {
    city: getCapitalizeFirstLetter(formDate.get(`event-destination`)),
    randomWaypointItem:  getCapitalizeFirstLetter(formDate.get(`event-type`)),
    offer: offersAll,
    photosCount: picturesAll,
    isFavorite: formDate.get(`event-favorite`) ? true : false,
    price: Number(formDate.get(`event-price`)),
    startDate: new Date(moment(formDate.get(`event-start-time`), `DD/MM/YY hh:mm`).valueOf()),
    endDate: new Date(moment(formDate.get(`event-end-time`), `DD/MM/YY hh:mm`).valueOf()),
    description: form.querySelector('.event__destination-description').textContent,
  }

  return formUser;
}

export default class EditForm extends AbstractSmartComponent {
  constructor(cards, countCard) {
    super();
    this._cards = cards;
    this._countCard = countCard;

    this._city = cards.city;
    this._typeOfWaypoints = cards.typeOfWaypoints;
    this._description = cards.description;
    this._startDate = cards.startDate;
    this._endDate = cards.endDate;
    this._offer = cards.offer;
    this._price = cards.price;
    this._photosCount = cards.photosCount;
    this._isFavorite = cards.isFavorite;
    this._randomWaypointItem = cards.randomWaypointItem;

    this._submitHandler = null;
    this._favoriteClickHandler = null;
    this._deleteButtonClickHandler = null;
    this._flatpickr = null;

    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createEditFormTemplate(this._cards, this._countCard, {
      city: this._city,
      description: this._description,
      offer: this._offer,
      isFavorite: this._isFavorite,
      randomWaypointItem: this._randomWaypointItem,
    });
  }

  reset() {
    const cards = this._cards;

    this._offer = cards.offer;
    this._description = cards.description;
    this._city = cards.city;
    this._isFavorite = cards.isFavorite;
    this._randomWaypointItem = cards.randomWaypointItem;

    this.rerender();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    // this.setFavoritesInputClickHandler(this._favoriteClickHandler);
    this.setDeleteBtnClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  // setFavoritesInputClickHandler(handler) {
  //   this.getElement().querySelector(`.event__favorite-icon`).addEventListener(`click`, handler);
  //   this._favoriteClickHandler = handler;
  // }

  setDeleteBtnClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  removeElement() {
    super.removeElement();
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);
    const formData = new FormData(form);

    return parseFormData(formData, form);

    // return parseFormData(this._city, this._typeOfWaypoints, this._description, this._startDate, this._endDate, this._offer, this._price, this._photosCount, this._isFavorite, this._randomWaypointItem);
  }

  _applyFlatpickr() {
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const typeListElement = element.querySelector(`.event__type-list`);
    const inputDestinationElement = element.querySelector(`.event__input--destination`);
    const eventFavorite = element.querySelector(`.event__favorite-icon`);


    typeListElement.addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        this._randomWaypointItem = getCapitalizeFirstLetter(evt.target.value);
        this._offer = getOffers();
        this.rerender();
      }
    });

    inputDestinationElement.addEventListener(`change`, (evt) => {
      this._city = evt.target.value;
      this._description = getRandomArrayItem(DESCRIPTION_ITEMS);
      this.rerender();
    });

    eventFavorite.addEventListener(`click`, () => {
      this._isFavorite = !this._isFavorite;
      this.rerender();
    });
  }
}
