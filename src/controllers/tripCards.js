const StatusCodesEsc = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
};

import MainEditFormComponent from '../components/create-site-maintContent-edit-form.js';
import MainWaypointItemComponent from '../components/create-site-maintContent-waypoint.js';
import {renderTemplate, RenderPosition, raplaceElement} from '../utils/render.js';


export default class TripCardController {
  constructor(container, onDataChange) {
    this._container = container;

    this._onDataChange = onDataChange;

    this._waypointItemComponent = null;
    this._editFormComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  renderTripCard(countCard) {

    this._waypointItemComponent = new MainWaypointItemComponent(countCard);
    this._editFormComponent = new MainEditFormComponent(countCard);

    this._waypointItemComponent.setBtnClickHandler(() => {
      this._replaceCardToFormCard();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceFormCardToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editFormComponent.setFavoritesInputClickHandler(() => {
      this._onDataChange(this, countCard, Object.assign({}, countCard, {isFavorite: !countCard.isFavorite}));
    });

    renderTemplate(this._container, this._waypointItemComponent, RenderPosition.BEFOREEND);
  }

  _replaceCardToFormCard() {
    raplaceElement(this._editFormComponent, this._waypointItemComponent);
  }

  _replaceFormCardToCard() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    raplaceElement(this._waypointItemComponent, this._editFormComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === StatusCodesEsc.ESCAPE || StatusCodesEsc.ESC;
    if (isEscKey) {
      this._replaceFormCardToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

}
