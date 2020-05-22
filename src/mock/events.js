import {getRandomArrayItem, getRandomIntegerNumber, shuffleArray, dayTripSort} from '../utils/common.js';

export const CITIES = [`Amsterdam`, `Chamonix`, `Geneva`, `Minsk`, `Havana`, `Paris`, `Budapest`, `Rome`, `Riga`, `London`];

const TYPE_OF_WAYPOINTS = {
  transfers: [`Taxi`, `Bus`, `Train`, `Ship`, `Drive`, `Flight`],
  activitys: [`Check-in`, `Sightseeing`, `Restaurant`],
  wayPointsAll: [`Taxi`, `Bus`, `Train`, `Ship`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`],
};


const OFFERS = [
  {title: `Add luggage`, price: getRandomIntegerNumber(20, 250)},
  {title: `Switch to comfort`, price: getRandomIntegerNumber(20, 250)},
  {title: `Add meal`, price: getRandomIntegerNumber(20, 250)},
  {title: `Choose seats`, price: getRandomIntegerNumber(20, 250)},
  {title: `Travel by train`, price: getRandomIntegerNumber(20, 250)},
];

export const DESCRIPTION_ITEMS = [
  `Равным образом укрепление и развитие структуры в значительной степени обуславливает создание направлений прогрессивного развития.`,
  `Повседневная практика показывает, что дальнейшее развитие различных форм деятельности требуют от нас анализа систем массового участия.`,
  `Идейные соображения высшего порядка, а также сложившаяся структура организации способствует подготовки и реализации соответствующий условий активизации.`,
  `Таким образом новая модель организационной деятельности играет важную роль в формировании соответствующий условий активизации.`
];

export const getOffers = () => {
  const copyOffers = OFFERS.slice();
  const options = copyOffers.slice(0, getRandomIntegerNumber(1, 5));
  return shuffleArray(options);
};

const getArrayPhotos = () => {
  const result = [{scr: `img/photos/1.jpg`, alt: `1`}, {scr: `img/photos/2.jpg`, alt: `2`}, {scr: `img/photos/3.jpg`, alt: `3`}];
  return result;
};

const {transfers, activitys} = TYPE_OF_WAYPOINTS;
const randomWaypointItem = [...transfers, ...activitys];
let mockTripSortDay = dayTripSort;

const generateCard = () => {
  return {
    id: String(new Date() + Math.random()),
    city: getRandomArrayItem(CITIES),
    typeOfWaypoints: TYPE_OF_WAYPOINTS,
    description: getRandomArrayItem(DESCRIPTION_ITEMS),
    startDate: mockTripSortDay.splice(0, 1)[0],
    endDate: mockTripSortDay.splice(0, 1)[0],
    offer: getOffers(),
    price: getRandomIntegerNumber(100, 200),
    photosCount: getArrayPhotos(),
    isFavorite: true,
    randomWaypointItem: getRandomArrayItem(randomWaypointItem),
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};

export {generateCard, generateCards};


