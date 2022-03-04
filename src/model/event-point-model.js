import {getCapitalizeFirstLetter} from '../utils/common.js';

export default class Card {
  constructor(data) {
    this.id = data[`id`];
    this.city = data[`destination`][`name`];
    this.description = data[`destination`][`description`];
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.offer = data[`offers`];
    this.price = data[`base_price`];
    this.photosCount = data[`destination`][`pictures`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.randomWayPointItem = getCapitalizeFirstLetter(data[`type`]);
  }

  toRAW() {
    const adapterCard = {
      'base_price': this.price,
      'date_from': this.startDate.toISOString(),
      'date_to': this.endDate.toISOString(),
      'destination': {
        'description': this.description,
        'name': this.city,
        'pictures': this.photosCount,
      },
      'id': this.id,
      'is_favorite': this.isFavorite,
      'offers': this.offer,
      'type': getCapitalizeFirstLetter(this.randomWayPointItem, false),
    };

    return adapterCard;
  }

  static parseCard(data) {
    return new Card(data);
  }

  static parseCards(data) {
    return data.map(Card.parseCard);
  }

  static clone(data) {
    return new Card(data.toRAW());
  }
}
