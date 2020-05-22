export default class Distonation {
  constructor() {
    this._distonation = null;
  }

  static setDistonation(distonation) {
    this._distonation = distonation;
  }

  static getDistonation() {
    return this._distonation;
  }
}
