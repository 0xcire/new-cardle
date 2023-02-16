import Manufacturers from './Manufacturer';
import { normalizeString } from '../utils/utils';

export default class Guess extends Manufacturers {
  constructor() {
    super();
    this.last = '';
    this.history = [];
    this.count = 0;
  }

  getMatchingManufacturers(currentValue) {
    const matches = this.list.filter((manufacturer, i) =>
      this.list[i].manufacturer
        .toLowerCase()
        .includes(currentValue.toLowerCase())
    );
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

  getCount() {
    return this.count;
  }

  increaseCount() {
    this.count += 1;
  }
}
