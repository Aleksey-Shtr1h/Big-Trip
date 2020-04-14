import {formatTime, formatDate, getRandomArrayItem} from '../utils.js';

const createRepeatingOffersMarkup = (options) => {
  return options.map((option) => {
    const {name, price} = option;
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
       </li>`
    );
  }).join(`\n \n`);
};

export const createWaypointItemTemplate = (card) => {
  const {city, typeOfWaypoints, startDate, endDate, offer, price} = card;

  const {transfers, activitys} = typeOfWaypoints;

  const randomWaypointItem = getRandomArrayItem([...transfers, ...activitys]);

  // const isExpired = startDate instanceof Date && startDate < Date.now();
  const isDateShowing = !!startDate;

  const time = isDateShowing ? formatTime(startDate) : ``;
  const date = isDateShowing ? formatDate(startDate) : ``;

  const nextTime = isDateShowing ? formatTime(endDate) : ``;
  const nextDate = isDateShowing ? formatDate(endDate) : ``;

  const repeatingOffersMarkup = createRepeatingOffersMarkup(offer);

  return (
    `<li class="trip-events__item">
      <div class="event">

        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${randomWaypointItem.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${randomWaypointItem} to ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${date}T${time}">${time}</time>
            &mdash;
            <time class="event__end-time" datetime="${nextDate}T${nextTime}">${nextTime}</time>
          </p>
          <p class="event__duration">30M</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${repeatingOffersMarkup}


        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};
