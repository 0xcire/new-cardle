import OPEN_GEOCODE_KEY from '../../env/env';

export default class Geocode {
  constructor() {
    this.locations = [];
    this.key = OPEN_GEOCODE_KEY;
    this.endpoint = 'http://api.openweathermap.org/geo/1.0/direct?';
    this.coordinates = {
      guess: {},
      answer: {},
    };
  }

  static convertToRadians(coordinate) {
    return (coordinate * Math.PI) / 180;
  }

  async getCoordinates(guessHQ, answerHQ) {
    try {
      const res = await Promise.all([
        fetch(`${this.endpoint}q=${guessHQ}&limit=1&appid=${this.key}`),
        fetch(`${this.endpoint}q=${answerHQ}&limit=1&appid=${this.key}`),
      ]);
      const data = await Promise.all(res.map((d) => d.json()));

      // data[0] = guess
      // data[1] = answer
      const coordinates = data.map((location) => ({
        lat: location[0]?.lat,
        lon: location[0]?.lon,
      }));
      [this.coordinates.guess, this.coordinates.answer] = coordinates;
    } catch (error) {
      throw new Error(error);
    }
  }

  degreeToRadians() {
    const rads = structuredClone(this.coordinates);
    Object.keys(rads).forEach((key) => {
      rads[key].lat = this.constructor.convertToRadians(rads[key].lat);
      rads[key].lon = this.constructor.convertToRadians(rads[key].lon);
    });

    return rads;
  }

  // distance between two points - Haversine's Formula
  distanceBetweenGuessAnswer() {
    const radians = this.degreeToRadians();
    // dlat -> delta lat
    const dlat = radians.answer.lat - radians.guess.lat;
    const dlon = radians.answer.lon - radians.guess.lon;

    // a represents the square of half the chord length between points
    const a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(radians.guess.lat) *
        Math.cos(radians.answer.lat) *
        Math.sin(dlon / 2) ** 2;

    // c represents angular distance in radians
    const c = 2 * Math.asin(Math.sqrt(a));
    // r = 6371 for km
    const r = 3956;

    return `${Math.round(c * r)} mi`;
  }

  angleFromGuessToAnswer() {
    const radians = this.degreeToRadians();
    const dy = radians.answer.lat - radians.guess.lat;
    const dx = radians.answer.lon - radians.guess.lon;
    let theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI;
    if (theta < 0) theta = 360 + theta;
    return Math.round(theta);
  }
}
