import AbstractComponent from './abstract-component.js';

import moment from "moment";

const createNumberDayTemplate = (day, countDay) => {
  return (
    `<li class="trip-days__item  day ${countDay + 1}">
      <div class="day__info">
        <span class="day__counter">${countDay + 1}</span>
        <time
          class="day__date"
          datetime="2019-03-18">${moment(day).format(`MMMM DD`)}
        </time>
      </div>

    </li>`
  );
};


export default class NumberDay extends AbstractComponent {
  constructor(day, index) {
    super();
    this._day = day;
    this._index = index;
  }

  getTemplate() {
    return createNumberDayTemplate(this._day, this._index);
  }

}
