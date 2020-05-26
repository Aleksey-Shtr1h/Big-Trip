import Card from './model/event-point-model.js';
import Distonation from './model/event-distonation-model.js';
import Offer from './model/event-offer-model.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const Urls = [`destinations`, `offers`, `points`];

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {

  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getCards() {
    return this._load({url: `points`})
      .then((response) => response.json())
      .then((data) => Card.parseCards(data));
  }

  updateCard(id, data) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Card.parseCard);
  }

  createCard(data) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Card.parseCard);
  }

  deleteCard(id) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  getData() {
    const requests = Urls.map((nameUrl) => this._load({url: nameUrl}));
    return Promise.all(requests)
      .then((responses) => Promise.all(responses
        .map((response) => response.json())))
      .then((responses) => {
        const [destinations, offers, points] = responses;
        Distonation.setDistonation(destinations);
        Offer.setOffers(offers);
        return Card.parseCards(points);
      });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
