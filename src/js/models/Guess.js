import Manufacturers from './Manufacturer';
import { normalizeString } from '../utils/utils';

export default class Guess extends Manufacturers {
  constructor() {
    super();
    this.last = '';
    this.history = [];
    this.count = 0;
  }

  getMatchingManufacturers(value) {
    const matches = this.list.filter((manufacturer, i) =>
      this.list[i].manufacturer.toLowerCase().includes(value.toLowerCase())
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
    this.history.unshift(guess);
  }

  previouslySubmitted(input) {
    return this.history.some(
      (guess) => normalizeString(guess) === normalizeString(input)
    );
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
