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
  typeOfWaypoints: {transfers: [], activitys: [], wayPointsAll: []},
  description: ``,
  startDate: new Date(),
  endDate: new Date(),
  offer: [],
  price: 0,
  photosCount: [],
  isFavorite: false,
  randomWaypointItem: `Taxi`,
};

import MainEditFormComponent from '../components/create-site-maintContent-edit-form.js';
import MainWaypointItemComponent from '../components/create-site-maintContent-waypoint.js';
import {renderTemplate, RenderPosition, raplaceElement, remove} from '../utils/render.js';


export default class TripCardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Modes.DEFAULT;

    this._waypointItemComponent = null;
    this._editFormComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  renderTripCard(card, countCard, mode) {
    const oldTaskComponent = this._waypointItemComponent;
    const oldTaskEditComponent = this._editFormComponent;
    this._mode = mode;

    this._waypointItemComponent = new MainWaypointItemComponent(card);
    this._editFormComponent = new MainEditFormComponent(card, countCard);

    this._waypointItemComponent.setBtnClickHandler(() => {
      this._replaceCardToFormCard();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const date = this._editFormComponent.getData();
      this._onDataChange(this, card, date);
    });

    // this._editFormComponent.setFavoritesInputClickHandler(() => {
    //   this._onDataChange(this, card, Object.assign({}, card, {isFavorite: !card.isFavorite}));
    // });

    this._editFormComponent.setDeleteBtnClickHandler(() => {
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
    if (this._mode !== Modes.DEFAULT) {
      this._replaceFormCardToCard();
    }
  }

  destroy() {
    remove(this._editFormComponent);
    remove(this._waypointItemComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
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
