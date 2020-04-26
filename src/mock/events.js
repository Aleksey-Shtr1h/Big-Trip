import {getRandomArrayItem, getRandomIntegerNumber, shuffleArray, dayTripSort} from '../utils/common.js';

const CITIES = [`Amsterdam`, `Chamonix`, `Geneva`, `Minsk`, `Havana`, `Paris`, `Budapest`, `Rome`, `Riga`, `London`];

const TYPE_OF_WAYPOINTS = {
  transfers: [`Taxi`, `Bus`, `Train`, `Ship`, `Drive`, `Flight`],
  activitys: [`Check-in`, `Sightseeing`, `Restaurant`],
};

const OFFERS = [
  {type: `luggage`, name: `Add luggage`, price: getRandomIntegerNumber(20, 250)},
  {type: `comfort`, name: `Switch to comfort`, price: getRandomIntegerNumber(20, 250)},
  {type: `meal`, name: `Add meal`, price: getRandomIntegerNumber(20, 250)},
  {type: `seats`, name: `Choose seats`, price: getRandomIntegerNumber(20, 250)},
  {type: `train`, name: `Travel by train`, price: getRandomIntegerNumber(20, 250)},
];

const DESCRIPTION_ITEMS = [
  `Равным образом укрепление и развитие структуры в значительной степени обуславливает создание направлений прогрессивного развития.`,
  `Повседневная практика показывает, что дальнейшее развитие различных форм деятельности требуют от нас анализа систем массового участия.`,
  `Идейные соображения высшего порядка, а также сложившаяся структура организации способствует подготовки и реализации соответствующий условий активизации.`,
  `Таким образом новая модель организационной деятельности играет важную роль в формировании соответствующий условий активизации.`
];

const getOffers = () => {
  const copyOffers = OFFERS.slice();
  const options = copyOffers.slice(0, getRandomIntegerNumber(1, 5));
  return shuffleArray(options);
};

const getArrayPhotos = (count) => {
  const result = [];

  let index = 1;

  while (index <= count) {
    result.push(index);
    index++;
  }
  return shuffleArray(result);
};

const {transfers, activitys} = TYPE_OF_WAYPOINTS;
const randomWaypointItem = [...transfers, ...activitys];
let a = dayTripSort;
const generateCard = () => {
  return {
    city: getRandomArrayItem(CITIES),
    typeOfWaypoints: TYPE_OF_WAYPOINTS,
    description: getRandomArrayItem(DESCRIPTION_ITEMS),
    startDate: a.splice(0, 1)[0],
    endDate: a.splice(0, 1)[0],
    offer: getOffers(),
    price: getRandomIntegerNumber(100, 200),
    photosCount: getArrayPhotos(getRandomIntegerNumber(1, 5)),
    isFavorite: Math.random() > 0.5,
    randomWaypointItem: getRandomArrayItem(randomWaypointItem),
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard)
    .sort((prev, next) => prev.startDate - next.startDate);
};

export {generateCard, generateCards};


