// import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';


import {formatDate, getRandomArrayItem, getCapitalizeFirstLetter} from '../utils/common.js';
import {CITIES, getOffers, DESCRIPTION_ITEMS} from '../mock/events.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import "flatpickr/dist/flatpickr.min.css";

// import moment from "moment";

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
    const {type, name, price} = option;
    const isChecked = (index === 0) ? true : false;
    return (
      `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${type}-${countCard}" type="checkbox"
          name="event-offer-${type}"
          ${isChecked ? `checked` : ``}>
        <label
          class="event__offer-label"
          for="event-offer-${type}-${countCard}">
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
    return (
      `<img class="event__photo" src="img/photos/${count}.jpg" alt="Event photo">`
    );
  }).join(`\n \n`);

  return result;
};


const createEditFormTemplate = (card, countCard, attributes = {}) => {

  const {city, typeOfWaypoints, description, startDate, endDate, offer, price, photosCount, isFavorite, randomWaypointItem} = attributes;
  const isDateShowing = !!startDate;

  const date = isDateShowing ? formatDate(startDate) : ``;

  const nextDate = isDateShowing ? formatDate(endDate) : ``;

  const favoritesButton = createFavoriteBtnMarkup(`favorite`, isFavorite, countCard);

  const repeatingOffersMarkup = createRepeatingOffersMarkup(offer, countCard);

  const typeUpper = getCapitalizeFirstLetter(randomWaypointItem);
  const isTypeAvailability = typeUpper ? typeUpper : randomWaypointItem;

  const repeatingTransfersMarkup = createRepeatingTransferMarkup(typeOfWaypoints.transfers, isTypeAvailability);

  const repeatingActivityMarkup = createRepeatingActivityMarkup(typeOfWaypoints.activitys, isTypeAvailability, countCard);
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
            <input class="event__input  event__input--time" id="event-start-time-${countCard}" type="text" name="event-start-time" value="${date}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${countCard}">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-${countCard}" type="text" name="event-end-time" value="${nextDate}">
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

const parseFormData = (city, typeOfWaypoints, description, startDate, endDate, offer, price, photosCount, isFavorite, randomWaypointItem, type) => {

  const formDate = {
    city,
    typeOfWaypoints,
    description,
    startDate,
    endDate,
    offer,
    price,
    photosCount,
    isFavorite,
    randomWaypointItem,
    type,
  };
  return formDate;
};

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

    this._type = null;
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
      typeOfWaypoints: this._typeOfWaypoints,
      description: this._description,
      startDate: this._startDate,
      endDate: this._endDate,
      offer: this._offer,
      price: this._price,
      photosCount: this._photosCount,
      isFavorite: this._isFavorite,
      randomWaypointItem: this._randomWaypointItem,
      type: this._type,
    });
  }

  reset() {
    const cards = this._cards;

    this._offer = cards.offer;
    this._description = cards.description;
    this._city = cards.city;
    this._isFavorite = cards.isFavorite;
    this._startDate = cards.startDate;
    this._endDate = cards.endDate;

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
    // if (this._flatpickr) {
    //   this._flatpickr.destroy();
    //   this._flatpickr = null;
    // }

    super.removeElement();
  }

  getData() {
    return parseFormData(this._city, this._typeOfWaypoints, this._description, this._startDate, this._endDate, this._offer, this._price, this._photosCount, this._isFavorite, this._randomWaypointItem, this._type);
  }

  _applyFlatpickr() {
    // this._startDate = flatpickr(this.getElement().querySelector(`input[name="event-start-time"]`), {
    //   allowInput: true,
    //   defaultDate: this._cards.startDate,
    //   dateFormat: `d/m/Y H:i`,
    //   minDate: this._cards.startDate,
    //   enableTime: true
    // });
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const typeListElement = element.querySelector(`.event__type-list`);
    const inputDestinationElement = element.querySelector(`.event__input--destination`);
    // const inputStartTimeElement = element.querySelector(`#event-start-time-${this._countCard}`);
    // const inputEndTimeElement = element.querySelector(`#event-end-time-${this._countCard}`);
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

    // inputStartTimeElement.addEventListener(`change`, (evt) => {
    //   this._startDate = evt.target.value;
    //   this.rerender();
    // })

    // inputEndTimeElement.addEventListener(`change`, (evt) => {
    //   this._endDate = evt.target.value;
    //   this.rerender();
    // })
  }
}
