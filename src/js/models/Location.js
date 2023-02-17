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
    this.units = 'mi';
  }

  reset() {
    Object.keys(this.coordinates).forEach((key) => {
      this.coordinates[key] = {};
    });
  }

  setUnits(units) {
    this.units = units;
  }

  convertDistance(distance) {
    if (this.units === 'km') {
      return Math.round(distance * 1.60934);
    }
    return Math.round(distance * 0.621371);
  }

  static convertToRadians(coordinate) {
    return (coordinate * Math.PI) / 180;
  }

  getLocation(headquarters) {
    return fetch(`${this.endpoint}q=${headquarters}&limit=1&appid=${this.key}`);
  }

  async getCoordinates(guessHQ, answerHQ) {
    try {
      const res = await Promise.all([
        this.getLocation(guessHQ),
        this.getLocation(answerHQ),
      ]);
      const data = await Promise.all(res.map((d) => d.json()));

      // data[0] = guess
      // data[1] = answer
      // [] implement better fallback when data[1] === {}
      const coordinates = data.map((location) => ({
        lat: location[0]?.lat ?? 0,
        lon: location[0]?.lon ?? 0,
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
    const r = this.units === 'mi' ? 3956 : 6371;

    return `${Math.round(c * r)} ${this.units}`;
  }

  angleFromGuessToAnswer() {
    const radians = this.degreeToRadians();
    const dlat = radians.answer.lat - radians.guess.lat;
    const dlon = radians.answer.lon - radians.guess.lon;

    let theta = Math.atan2(dlat, dlon);
    theta *= 180 / Math.PI;
    if (theta < 0) theta = 360 + theta;
    return Math.round(theta);
  }
}
