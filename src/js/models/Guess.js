import Manufacturers from './Manufacturer';
import { normalizeString } from '../utils/utils';

export default class Guess extends Manufacturers {
  constructor() {
    super();
    this.last = '';
    this.history = [];
    this.count = 0;
  }

  getCount() {
    return this.count;
  }

  reset() {
    this.count = 0;
    this.history.length = 0;
    this.setAnswer();
  }

  getMatchingManufacturers(currentValue) {
    const matches = this.list.filter((item, i) => {
      return normalizeString(this.list[i].manufacturer).includes(
        normalizeString(currentValue)
      );
    });
    return matches;
  }

  inList() {
    return this.list.find(
      (listItem) =>
        normalizeString(listItem.manufacturer) === normalizeString(this.last)
    );
  }

  addGuessToHistory(guess) {
    this.history.unshift(normalizeString(guess));
  }

  previouslySubmitted(input) {
    return this.history.some((guess) => guess === normalizeString(input));
  }

  matchesAnswer() {
    if (
      normalizeString(this.last) === normalizeString(this.answer.manufacturer)
    ) {
      return true;
    }
    return false;
  }

  increaseCount() {
    this.count += 1;
  }
}
