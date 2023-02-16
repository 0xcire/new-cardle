import manufacturers from '../data/manufacturers.json';

// at end
// add feature to set random 'answer' to local storage, resets every midnight
// cant be same answer twice in a row 'since relatively small data set'

export default class Manufacturers {
  constructor() {
    this.list = manufacturers;
    this.answer = this.list[this.randomIndex()];
  }

  randomIndex() {
    const index = Math.floor(Math.random() * this.list.length);
    return index;
  }

  setAnswer() {
    this.answer = this.list[this.randomIndex()];
  }
}
