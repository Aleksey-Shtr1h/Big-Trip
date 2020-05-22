export default class Offer {
  constructor() {
    this._offers = null;
  }

  static setOffers(offers) {
    this._offers = offers;
  }

  static getOffers() {
    return this._offers;
  }
}
