import manufacturers from '../data/manufacturers.json';

// ideal: guess gets stored to local storage
// is deleted everyday at midnight

export default class Manufacturers {
  constructor() {
    this.data = manufacturers;
    this.answer = this.data[this.randomIndex()];
  }

  randomIndex() {
    const index = Math.floor(Math.random() * this.data.length);
    return index;
  }
}
