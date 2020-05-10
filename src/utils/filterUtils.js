import {FilterType} from '../constants.js';

const getFutureCards = (cards) => {
  return cards.filter((card) => card.startDate > new Date());
};

const getPastCards = (cards) => {
  return cards.filter((card) => card.startDate < new Date());
};


export const getCardsByFilter = (cards, filterType) => {

  switch (filterType) {
    case FilterType.EVERYTHING:
      return cards;
    case FilterType.FUTURE:
      return getFutureCards(cards);
    case FilterType.PAST:
      return getPastCards(cards);
  }

  return cards;
};
