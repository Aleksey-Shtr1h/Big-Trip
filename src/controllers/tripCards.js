import moment from "moment";

import PointModel from "../model/event-point-model.js";
import DistonationModel from "../model/event-distonation-model.js";
import OfferModel from "../model/event-offer-model.js";

import MainEditFormComponent from '../components/create-site-maintContent-edit-form.js';
import MainWaypointItemComponent from '../components/create-site-maintContent-waypoint.js';

import {renderTemplate, RenderPosition, raplaceElement, remove} from '../utils/render.js';
import {getCapitalizeFirstLetter} from '../utils/common.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

const EscapeKey = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
};

export const Modes = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyCard = {
  id: String(new Date() + Math.random()),
  city: ``,
  description: ``,
  startDate: new Date(),
  endDate: new Date(),
  offer: [],
  price: 0,
  photosCount: [],
  isFavorite: false,
  randomWaypointItem: ``,
};

const parseFormData = (formDate, form, idCard) => {
  const picturesAll = [];
  const offersAll = [];
  const picturesElement = form.querySelectorAll(`.event__photo`);
  const offersElement = form.querySelectorAll(`.event__offer-checkbox:checked + label[for^="event"]`);

  picturesElement.forEach((picture) => {
    picturesAll.push({
      src: picture.src,
      description: picture.alt,
    });
  });

  offersElement.forEach((offer) => {
    offersAll.push({
      title: offer.querySelector(`.event__offer-title`).textContent,
      price: Number(offer.querySelector(`.event__offer-price`).textContent),
    });
  });

  return new PointModel({
    'base_price': Number(formDate.get(`event-price`)),

    'date_from': new Date(moment(formDate.get(`event-start-time`), `DD/MM/YY hh:mm`).valueOf()),

    'date_to': new Date(moment(formDate.get(`event-end-time`), `DD/MM/YY hh:mm`).valueOf()),

    'destination': {
      'description': form.querySelector(`.event__destination-description`).textContent,

      'name': getCapitalizeFirstLetter(formDate.get(`event-destination`)),

      'pictures': picturesAll,

    },

    'id': String(idCard + 1),

    'is_favorite': form.querySelector(`.event__favorite-checkbox`).checked ? true : false,
    'offers': offersAll,
    'type': formDate.get(`event-type`),
  });
};

export default class TripCardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._distonation = DistonationModel.getDistonation();
    this._offers = OfferModel.getOffers();

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Modes.DEFAULT;

    this._waypointItemComponent = null;
    this._editFormComponent = null;
    this._idCard = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  renderTripCard(card, countCard, mode) {
    this._idCard = this._idCard < Number(card.id) ? Number(card.id) : this._idCard;
    const oldTaskComponent = this._waypointItemComponent;
    const oldTaskEditComponent = this._editFormComponent;
    this._mode = mode;

    this._replaceEmptyCard();

    this._waypointItemComponent = new MainWaypointItemComponent(card);
    this._editFormComponent = new MainEditFormComponent(card, countCard, this._distonation, this._offers);

    this._waypointItemComponent.setBtnClickHandler(() => {
      this._replaceCardToFormCard();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editFormComponent.setBtnClickCloseHandler(() => {
      this._replaceFormCardToCard();
      this._onDataChange(this, card, card);
    });

    this._editFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const formUser = this._editFormComponent.getData();
      const data = parseFormData(formUser.formData, formUser.form, this._idCard);

      this._editFormComponent.setData({
        saveButtonText: `Saving...`,
      });
      this._onDataChange(this, card, data);
    });

    this._editFormComponent.setFavoritesInputClickHandler(() => {
      const newCard = PointModel.clone(card);
      newCard.isFavorite = !newCard.isFavorite;

      this._onDataChange(this, card, newCard);
    });

    this._editFormComponent.setDeleteBtnClickHandler(() => {
      this._editFormComponent.setData({
        deleteButtonText: `Deleting...`,
      });

      this._onDataChange(this, card, null);
    });

    switch (mode) {
      case Modes.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          raplaceElement(this._waypointItemComponent, oldTaskComponent);
          raplaceElement(this._editFormComponent, oldTaskEditComponent);
          this._replaceFormCardToCard();
        } else {
          renderTemplate(this._container, this._waypointItemComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Modes.ADDING:

        if (oldTaskEditComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderTemplate(this._container, this._editFormComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode === Modes.ADDING) {
      this._onDataChange(this, EmptyCard, null);
    }
    if (this._mode !== Modes.DEFAULT) {
      this._replaceFormCardToCard();
    }

  }

  destroy() {
    remove(this._editFormComponent);
    remove(this._waypointItemComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._editFormComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._waypointItemComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._editFormComponent.getElement().style.animation = ``;
      this._waypointItemComponent.getElement().style.animation = ``;

      this._editFormComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
      this._editFormComponent.disableForm(false);
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _replaceEmptyCard() {
    EmptyCard.id = String(this._idCard + 1);
    EmptyCard.offer = this._offers.find((offerApi) => offerApi.type === `flight`).offers;
    EmptyCard.randomWaypointItem = this._offers.find((offerApi) => offerApi.type === `flight`).type;
  }

  _replaceCardToFormCard() {
    this._onViewChange();
    raplaceElement(this._editFormComponent, this._waypointItemComponent);
    this._mode = Modes.EDIT;
  }

  _replaceFormCardToCard() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._editFormComponent.reset();

    if (document.contains(this._editFormComponent.getElement())) {
      raplaceElement(this._waypointItemComponent, this._editFormComponent);
    }

    this._mode = Modes.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === EscapeKey.ESCAPE;

    if (isEscKey) {
      if (this._mode === Modes.ADDING) {
        this._onDataChange(this, EmptyCard, null);
      }

      this._replaceFormCardToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
