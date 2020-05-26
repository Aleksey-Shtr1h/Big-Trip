import moment from "moment";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

import AbstractSmartComponent from './abstract-smart-component.js';
import {getCapitalizeFirstLetter} from '../utils/common.js';
import {TypeOfWayPoint} from '../constants.js';
import "flatpickr/dist/flatpickr.min.css";

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const createFavoriteBtnMarkup = (isActive = true, countCard, showElement) => {
  return (
    `<input
      id="event-favorite-${countCard}"
      class="event__favorite-checkbox  visually-hidden"
      type="checkbox"
      name="event-favorite"
      ${isActive ? `checked` : ``}>

    <label
      class="event__favorite-btn ${showElement ? `visually-hidden` : ``}"
      for="event-favorite-${countCard}">
      <span class="visually-hidden">
        Add to favorite
      </span>

      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const createRepeatingOffersMarkup = (options) => {

  return options.map((option, index) => {
    const {title, price, check} = option;

    return (
      `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${title}-${index}"
          type="checkbox"
          name="${title}"
          ${check ? `checked` : ``}>
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

const createRepeatingTransferMarkup = (typeOfWayPoints, randomItem) => {

  const result = typeOfWayPoints.map((wayPoint) => {
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

const createRepeatingActivityMarkup = (typeOfWayPoints, randomItem, countCard) => {

  const result = typeOfWayPoints.map((wayPoint) => {
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

const createRepeatingPhotoMarkup = (photos) => {
  const result = photos.map((photo) => {
    return (
      `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`
    );
  }).join(`\n \n`);

  return result;
};

const getCities = (distonations) => {
  return distonations.map((distonation) => distonation.name);
};

const getCitiesMarkup = (cities, city) => {
  return cities.map((cityCard) => {
    return (`<option value="${cityCard}" ${cityCard === city ? `selected` : ``}>${cityCard}</option>`
    );
  }).join(`\n \n`);
};


const createEditFormTemplate = (card, attributes = {}) => {
  const {city, description, offer, isFavorite, randomWayPointItem, photosCount, startDate, endDate, externalData, dataoOffers, countCard, distonations, price} = attributes;

  const showOffers = (offer.length === 0) ? true : false;
  const showPhotos = (photosCount.length === 0) ? true : false;
  const valueCountNewEvent = (countCard === -2) ? true : false;
  const offersData = (countCard === -2) ? offer : dataoOffers;

  const cities = getCities(distonations);
  const citiesMarkup = getCitiesMarkup(cities, city);

  const favoritesButton = createFavoriteBtnMarkup(isFavorite, countCard, valueCountNewEvent);

  const repeatingOffersMarkup = createRepeatingOffersMarkup(offersData, countCard);

  const typeUpper = getCapitalizeFirstLetter(randomWayPointItem);
  const isTypeAvailability = typeUpper ? typeUpper : randomWayPointItem;

  const replaceInTo = TypeOfWayPoint.ACTIVITYS.includes(isTypeAvailability);

  const repeatingTransfersMarkup = createRepeatingTransferMarkup(TypeOfWayPoint.TRANSFERS, isTypeAvailability);

  const repeatingActivityMarkup = createRepeatingActivityMarkup(TypeOfWayPoint.ACTIVITYS, isTypeAvailability, countCard);
  const repeatingPhotoMarkup = createRepeatingPhotoMarkup(photosCount);

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  return (
    `<li class="trip-events__item">
      <form
      class="${valueCountNewEvent ? `trip-events__item` : ``} event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${countCard}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${randomWayPointItem.toLowerCase()}.png" alt="Event type icon">
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
              ${isTypeAvailability} ${replaceInTo ? `in` : `to`}
            </label>
            <select class="event__input  event__input--destination" id="event-destination-${countCard}"
              type="text"
              name="event-destination"
              value="${city}"
              list="destination-list-${countCard}">
            <datalist id="destination-list-${countCard}">
              <option value=""></option>
              ${citiesMarkup}
            </datalist>
            </select>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${countCard}">
              From
            </label>

            <input
              class="event__input  event__input--time"
              id="event-start-time-${countCard}"
              type="text"
              name="event-start-time"
              value="${moment(startDate).format(`DD/MM/YY HH:mm`)}">
            &mdash;

            <label class="visually-hidden" for="event-end-time-${countCard}">
              To
            </label>

            <input
              class="event__input  event__input--time"
              id="event-end-time-${countCard}"
              type="text"
              name="event-end-time"
              value="${moment(endDate).format(`DD/MM/YY HH:mm`)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${countCard}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price"
              id="event-price-${countCard}"
              type="number"
              min="0"
              name="event-price"
              value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
          <button class="event__reset-btn" type="reset">
            ${valueCountNewEvent ? `Cancel` : `${deleteButtonText}`}
          </button>

          ${favoritesButton}

          <button class="visually-hidden event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>

        </header>

        <section class="event__details">

          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers ${showOffers ? `visually-hidden` : ``}">Offers</h3>

            <div class="event__available-offers">
              ${repeatingOffersMarkup}
            </div>
          </section>

          <section
          class="event__section  event__section--destination ${showPhotos ? `visually-hidden` : ``}">
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
  constructor(cards, countCard, distonation, offers) {
    super();
    this._cards = cards;
    this._countCard = countCard;
    this._distonationApi = distonation;
    this._offersApi = offers;

    this._city = cards.city;
    this._typeOfWayPoints = cards.typeOfWayPoints;
    this._description = cards.description;
    this._startDate = cards.startDate;
    this._endDate = cards.endDate;
    this._offer = cards.offer;
    this._price = cards.price;
    this._photosCount = cards.photosCount;
    this._isFavorite = cards.isFavorite;
    this._randomWayPointItem = cards.randomWayPointItem;

    this._externalData = DefaultData;

    this._submitHandler = null;
    this._favoriteClickHandler = null;
    this._deleteButtonClickHandler = null;
    this._btnClickCloseHandler = null;
    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;
    this._dataoOffers = null;
    this._newOffers = null;
    this._startOldDate = null;
    this._endOldDate = null;

    this._updateOffers();
    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createEditFormTemplate(this._cards, {
      countCard: this._countCard,
      city: this._city,
      description: this._description,
      offer: this._offer,
      isFavorite: this._isFavorite,
      randomWayPointItem: this._randomWayPointItem,
      photosCount: this._photosCount,
      startDate: this._startDate,
      endDate: this._endDate,
      externalData: this._externalData,
      dataoOffers: this._dataoOffers,
      distonations: this._distonationApi,
      price: this._price,
    });
  }

  reset() {
    const cards = this._cards;

    this._offer = cards.offer;
    this._description = cards.description;
    this._city = cards.city;
    this._isFavorite = cards.isFavorite;
    this._randomWayPointItem = cards.randomWayPointItem;

    this.rerender();
  }

  rerender() {
    super.rerender();
    this._validationForm();
    this._applyFlatpickr();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavoritesInputClickHandler(this._favoriteClickHandler);
    this.setDeleteBtnClickHandler(this._deleteButtonClickHandler);
    this.setBtnClickCloseHandler(this._btnClickCloseHandler);
    this._subscribeOnEvents();
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
    this.disableForm(true);
  }

  disableForm(isActive) {
    [].concat(this.getElement().querySelectorAll(`input`),
        this.getElement().querySelectorAll(`select`), this.getElement().querySelectorAll(`label`), this.getElement().querySelectorAll(`button`))
    .forEach((selectElements) => {
      selectElements.forEach((element) => {
        element.disabled = isActive;
        element.checked = !isActive;
      });
    });
  }

  setBtnClickCloseHandler(handler) {
    if (this._countCard === -2) {
      this.getElement().querySelector(`.event__rollup-btn`).style.position = `absolute`;
    }

    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);

    this._btnClickCloseHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setDeleteBtnClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setFavoritesInputClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, handler);

    this._favoriteClickHandler = handler;
  }

  removeElement() {

    if (this._flatpickrStartDate || this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrEndDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate = null;
    }

    super.removeElement();
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);
    const formData = new FormData(form);

    return {
      formData,
      form,
    };
  }

  _applyFlatpickr() {
    if (this._flatpickrStartDate || this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrEndDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate = null;
    }

    const dateElementStart = this.getElement().querySelector(`#event-start-time-${this._countCard}`);

    this._flatpickrStartDate = flatpickr(dateElementStart, {
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      defaultDate: this._startDate || `today`,
      time_24hr: true, // eslint-disable-line camelcase
      allowInput: true,
    });

    const dateElementEnd = this.getElement().querySelector(`#event-end-time-${this._countCard}`);

    this._flatpickrEndDate = flatpickr(dateElementEnd, {
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      defaultDate: this._endDate || `today`,
      time_24hr: true, // eslint-disable-line camelcase
      allowInput: true,
    });
  }

  _validationForm() {

    if (new Date(moment(this._startDate, `DD/MM/YY hh:mm`).valueOf()) >= new Date(moment(this._endDate, `DD/MM/YY hh:mm`).valueOf())) {
      const inputEndTime = this.getElement().querySelector(`#event-end-time-${this._countCard}`);
      const divTime = this.getElement().querySelector(`.event__field-group--time`);
      divTime.style.border = `2px solid red`;
      inputEndTime.setCustomValidity(`Время маршрута некорректно`);
    }

    if (this._city === ``) {
      const selectCity = this.getElement().querySelector(`.event__input--destination`);
      const selectCityDiv = this.getElement().querySelector(`.event__field-group--destination`);
      selectCityDiv.style.border = `2px solid red`;
      const selectCityValue = selectCity.value;
      if (selectCityValue === ``) {
        selectCity.setCustomValidity(`Выберите город`);
      }
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const typeListElement = element.querySelector(`.event__type-list`);
    const inputDestinationElement = element.querySelector(`.event__input--destination`);
    const inputStartTime = element.querySelector(`#event-start-time-${this._countCard}`);
    const inputEndTime = element.querySelector(`#event-end-time-${this._countCard}`);
    const inputPrice = element.querySelector(`.event__input--price`);

    typeListElement.addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        this._randomWayPointItem = evt.target.value;

        this._offer = this._offersApi
        .find((offerApi) => offerApi.type === this._randomWayPointItem)
        .offers;
        this._updateOffers();

        this.rerender();
      }
    });

    inputDestinationElement.addEventListener(`change`, (evt) => {
      this._city = evt.target.value;

      if (this._city) {
        this._description = this._distonationApi
        .find((city) => city.name === this._city)
        .description;

        this._photosCount = this._distonationApi
        .find((city) => city.name === this._city)
        .pictures;
      } else {
        this._description = ``;
        this._photosCount = [];
      }

      this._updateOffers();
      this._updateNewOffers();
      this.rerender();
    });

    inputStartTime.addEventListener(`change`, (evt) => {
      this._startDate = evt.target.value;

      this._updateOffers();
      this._updateNewOffers();
      this.rerender();
    });

    inputEndTime.addEventListener(`change`, (evt) => {
      this._endDate = evt.target.value;

      this._updateOffers();
      this._updateNewOffers();
      this.rerender();
    });

    inputPrice.addEventListener(`change`, (evt) => {
      this._price = evt.target.value;
    });
  }

  _updateOffers() {
    const dataApi = this._offersApi.find((offerApi) => {
      return offerApi.type === this._randomWayPointItem.toLowerCase();
    });

    dataApi.offers.forEach((offerApi) => {
      offerApi.check = false;
      this._offer.map((offer) => {
        if (offerApi.title === offer.title) {
          offerApi.check = true;
          offer.check = false;
        }
      });
    });

    this._dataoOffers = dataApi.offers;
  }

  _updateNewOffers() {
    this._newOffers = [];
    const offersElement = this.getElement().querySelectorAll(`.event__offer-checkbox:checked + label[for^="event"]`);

    offersElement.forEach((offer) => {
      this._newOffers.push({
        title: offer.querySelector(`.event__offer-title`).textContent,
        price: Number(offer.querySelector(`.event__offer-price`).textContent),
      });
    });

    this._offer.forEach((offer) => {
      this._newOffers.map((newOffer) => {
        if (offer.title === newOffer.title) {
          offer.check = true;
        }
      });
    });
  }

}
