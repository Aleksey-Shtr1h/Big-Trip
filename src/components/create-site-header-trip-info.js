import AbstractComponent from './abstract-component.js';
import moment from "moment";

const FIRST_ELEMNT = 1;
const END_ELEMNT = -1;
const MIN_COUNT_CITY = 3;

const getEventInfoCity = (coutsCity) => {
  const firstCity = coutsCity.slice(0, FIRST_ELEMNT);
  const endCity = coutsCity.slice(END_ELEMNT);

  if (coutsCity.length <= MIN_COUNT_CITY) {
    return coutsCity.map((elem) => elem).join(`\n\u2014 `);
  } else {
    return `${firstCity}\n...\n\u2014\n...\n${endCity}`;
  }
};

const getEventInfoDay = (daysStart, daysEnd) => {
  const start = new Date(daysStart[0]).getMonth();
  const end = new Date(daysEnd[0]).getMonth();

  if (start === end) {
    return `${moment(daysStart[0]).format(`MMMM DD`)}\n\u2014\n${moment(daysEnd[0]).format(`DD`)}`;
  } else {
    return `${moment(daysStart[0]).format(`MMMM DD`)}\n\u2014\n${moment(daysEnd[0]).format(`MMMM DD`)}`;
  }
};

const createInfoTripTemplate = (cards) => {
  const coutsCity = [...new Set(cards.map((elem) => elem.city))];

  const daysStart = [...new Set(cards
      .sort((prev, next) => prev.startDate - next.startDate)
      .map((card) => card.startDate))].slice(0, FIRST_ELEMNT);

  const daysEnd = [...new Set(cards
      .sort((prev, next) => prev.startDate - next.startDate)
      .map((card) => card.endDate))].slice(END_ELEMNT);

  const eventInfoCity = getEventInfoCity(coutsCity);
  const eventInfoDay = getEventInfoDay(daysStart, daysEnd);
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">
        ${eventInfoCity}
      </h1>

      <p class="trip-info__dates">
        ${eventInfoDay}
      </p>
    </div>`
  );
};

export default class InfoContainer extends AbstractComponent {
  constructor(cardsModel) {
    super();
    this._cardsModel = cardsModel;
  }

  getTemplate() {
    return createInfoTripTemplate(this._cardsModel);
  }

}
