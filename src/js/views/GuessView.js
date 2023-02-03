import { debounce } from '../utils/utils';

export default class guessView {
  constructor() {
    // super();
    this.input = document.querySelector('#guess-input');
    this.suggestionContainer = document.querySelector('.suggestions');
  }

  static resetInput(e) {
    e.target.value = '';
  }

  resetSuggestionContainer() {
    this.suggestionContainer.innerHTML = '';
  }

  renderSuggestions(array, e) {
    this.resetSuggestionContainer();
    if (e.target.value === '') return;
    const suggestions = array;
    suggestions.forEach((suggestion) => {
      const sugg = document.createElement('div');
      sugg.classList.add('suggestion');
      sugg.textContent = suggestion.manufacturer;
      this.suggestionContainer.appendChild(sugg);
    });
  }

  getSuggestions = debounce((callback, e) => {
    const suggestions = callback(e.target.value);
    this.renderSuggestions(suggestions, e);
  }, 500);

  bindOnInputChange(callback) {
    this.input.addEventListener('input', (e) => {
      this.getSuggestions(callback, e);
    });
  }

  bindSuggestionEvent(callback) {
    document.addEventListener('click', (e) => {
      if (e.target.matches('.suggestion')) {
        this.resetSuggestionContainer();
        callback(e.target.textContent);
      }
    });
  }

  bindGuessInput(callback) {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        callback(e.target.value);
        this.constructor.resetInput(e);
      }
    });
  }
}
