const StatusCodesEsc = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
};

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

import MainEditFormComponent from '../components/create-site-maintContent-edit-form.js';
import MainWaypointItemComponent from '../components/create-site-maintContent-waypoint.js';
import {renderTemplate, RenderPosition, raplaceElement} from '../utils/render.js';


export default class TripCardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._waypointItemComponent = null;
    this._editFormComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  renderTripCard(card) {
    const oldTaskComponent = this._waypointItemComponent;
    const oldTaskEditComponent = this._editFormComponent;

    this._waypointItemComponent = new MainWaypointItemComponent(card);
    this._editFormComponent = new MainEditFormComponent(card);

    this._editFormComponent.setFavoritesInputClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {isFavorite: !card.isFavorite}));
    });

    this._waypointItemComponent.setBtnClickHandler(() => {
      this._replaceCardToFormCard();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceFormCardToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    if (oldTaskEditComponent && oldTaskComponent) {
      raplaceElement(this._waypointItemComponent, oldTaskComponent);
      raplaceElement(this._editFormComponent, oldTaskEditComponent);
    } else {
      renderTemplate(this._container, this._waypointItemComponent, RenderPosition.BEFOREEND);
    }
  }

  _replaceCardToFormCard() {
    this._onViewChange();
    raplaceElement(this._editFormComponent, this._waypointItemComponent);
    this._mode = Mode.EDIT;
  }

  _replaceFormCardToCard() {
    this._editFormComponent.reset();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    raplaceElement(this._waypointItemComponent, this._editFormComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === StatusCodesEsc.ESCAPE || StatusCodesEsc.ESC;
    if (isEscKey) {
      this._replaceFormCardToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormCardToCard();
    }
  }
}
