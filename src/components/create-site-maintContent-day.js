import AbstractComponent from './abstract-component.js';

const createNumberDayTemplate = (card, countDay) => {
  return (
    `<li class="trip-days__item  day ${countDay + 1}">
      <div class="day__info">
        <span class="day__counter">${countDay + 1}</span>
        <time class="day__date" datetime="2019-03-18">MAR 18</time>
      </div>

    </li>`
  );
};


export default class NumberDay extends AbstractComponent {
  constructor(cards, index) {
    super();
    this._cards = cards;
    this._index = index;
  }

  getTemplate() {
    return createNumberDayTemplate(this._cards, this._index);
  }

}
