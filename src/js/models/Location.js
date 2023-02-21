import OPEN_GEOCODE_KEY from '../../env/env';

export default class Geocode {
  constructor() {
    this.locations = [];
    this.key = OPEN_GEOCODE_KEY;
    this.endpoint = 'https://api.openweathermap.org/geo/1.0/direct?';
    this.coordinates = {
      guess: {},
      answer: {},
    };
    this.units = 'mi';
  }

  setUnits(units) {
    if (this.units === units) return;
    this.units = units;
  }

  reset() {
    Object.keys(this.coordinates).forEach((key) => {
      this.coordinates[key] = {};
    });
  }

  convertDistance(distance) {
    if (this.units === 'km') {
      return `${Math.round(distance * 1.60934)} km`;
    }
    return `${Math.round(distance * 0.621371)} mi`;
  }

  static convertToRadians(degree) {
    return degree * (Math.PI / 180);
  }

  static convertToDegrees(radians) {
    return radians * (180 / Math.PI);
  }

  getLocation(headquarters) {
    return fetch(`${this.endpoint}q=${headquarters}&limit=5&appid=${this.key}`);
  }

  async getCoordinates(guessHQ, answerHQ) {
    try {
      const res = await Promise.all([
        this.getLocation(guessHQ),
        this.getLocation(answerHQ),
      ]);
      const data = await Promise.all(res.map((d) => d.json()));

      const match = data.map((set) => {
        const guess = [
          guessHQ.split(',')[0].replace(/\W/g, ' '),
          guessHQ.split(',')[1].trim(),
        ];
        const answer = [
          answerHQ.split(',')[0].replace(/\W/g, ' '),
          answerHQ.split(',')[1].trim(),
        ];
        return set.find((location) => {
          if (location.name === guess[0] && location?.state === guess[1]) {
            return location;
          }
          if (location.name === guess[0] && location?.country === guess[1]) {
            return location;
          }
          if (location.name === answer[0] && location?.state === answer[1]) {
            return location;
          }
          if (location.name === answer[0] && location?.country === answer[1]) {
            return location;
          }
          return false;
        });
      });

      const coordinates = match.map((location) => ({
        lat: location?.lat,
        lon: location?.lon,
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
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const r = this.units === 'mi' ? 3956 : 6371;

    return `${Math.round(c * r)} ${this.units}`;
  }

  angleFromGuessToAnswer() {
    const radians = this.degreeToRadians();
    const dlat = radians.answer.lat - radians.guess.lat;
    const dlon = radians.answer.lon - radians.guess.lon;

    let theta = Math.atan2(dlat, dlon);
    theta = this.constructor.convertToDegrees(theta);
    theta = (theta + 360) % 360;
    return theta;
  }
}
