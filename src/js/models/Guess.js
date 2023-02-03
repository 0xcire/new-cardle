import Manufacturers from './Manufacturer';

export default class Guess extends Manufacturers {
  constructor() {
    super();
    this.guess = '';
    this.count = 0;
  }

  getMatchingManufacturers(value) {
    const matches = this.data.filter((manufacturer, i) =>
      this.data[i].manufacturer.toLowerCase().includes(value.toLowerCase())
    );
    return matches;
  }

  formatAnswer() {
    return this.answer.manufacturer.replace(/\s/g, '').toLowerCase();
  }

  formatGuess() {
    return this.guess.replace(/\s/g, '').toLowerCase();
  }

  matchesAnswer(guess) {
    this.guess = guess;
    if (this.formatGuess() === this.formatAnswer()) {
      return true;
    }
    return false;
  }

  getCount() {
    return this.count;
  }

  increaseCount() {
    this.count += 1;
  }
}
