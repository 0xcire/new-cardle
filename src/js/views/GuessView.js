import { debounce } from '../utils/utils';
import Loader from './Loader';

export default class guessView {
  constructor() {
    // super();
    this.loader = new Loader();
    this.input = document.querySelector('#guess-input');
    this.suggestionContainer = document.querySelector('.suggestions');
    this.guessContainer = document.querySelector('.guesses');
  }

  resetInput() {
    this.input.value = '';
  }

  disableInput() {
    this.input.disabled = true;
  }

  resetSuggestionContainer() {
    this.suggestionContainer.innerHTML = '';
  }

  // one func out of these? normal suggestion card | guess does not exist | already guessed
  // refactor later[]
  createSuggestionCard(suggestion) {
    const container = document.createElement('div');
    container.classList.add('suggestion');
    container.dataset.type = 'suggestion';
    container.tabIndex = 0;
    container.textContent = suggestion.manufacturer;
    this.suggestionContainer.appendChild(container);
  }

  renderInvalidGuessError() {
    const container = document.createElement('div');
    container.classList.add('suggestion', 'suggestion-error');
    container.textContent = 'not a manufacturer';
    this.suggestionContainer.appendChild(container);
  }

  renderAlreadyGuessedError() {
    const container = document.createElement('div');
    container.classList.add('suggestion', 'suggestion-error');
    container.textContent = 'already guessed';
    this.suggestionContainer.appendChild(container);
  }

  renderOutOfGuesses() {
    const container = document.createElement('div');
    container.classList.add('suggestion', 'suggestion-error');
    container.textContent = `out of guesses`;
    this.suggestionContainer.appendChild(container);
  }

  // can combine these three as well potentially
  renderWinCard(manufacturer) {
    const container = document.createElement('div');
    container.classList.add('guess', 'correct');

    const name = document.createElement('p');
    name.classList.add('name');
    name.textContent = `${manufacturer} is correct!`;
    container.appendChild(name);
    this.guessContainer.insertAdjacentElement('afterbegin', container);
  }

  renderLossCard(manufacturer) {
    const container = document.createElement('div');
    container.classList.add('guess', 'guess-loss');

    const name = document.createElement('p');
    name.classList.add('name');
    name.textContent = `${manufacturer} was correct!`;
    container.appendChild(name);
    this.guessContainer.insertAdjacentElement('afterbegin', container);
  }

  renderValidGuessCard(guess, dist, ang) {
    const container = document.createElement('div');
    container.classList.add('guess');

    const name = document.createElement('p');
    name.classList.add('name');
    name.textContent = guess;

    const indicators = document.createElement('div');
    indicators.classList.add('indicators');
    const distance = document.createElement('p');
    distance.classList.add('distance');
    distance.textContent = dist;

    const angle = document.createElement('p');
    angle.classList.add('arrow', 'direction');
    angle.innerHTML = '&rarr;';
    angle.style.transform = `rotate(-${ang}deg)`;

    indicators.appendChild(distance);
    indicators.appendChild(angle);

    container.appendChild(name);
    container.appendChild(indicators);
    this.guessContainer.insertAdjacentElement('afterbegin', container);
  }

  renderSuggestions(array, e) {
    if (e.target.value === '') return;
    const suggestions = array;
    suggestions.forEach((suggestion) => {
      this.createSuggestionCard(suggestion);
    });
  }

  // renderAutoSuggestions
  // i thought this concept was interesting
  // understand it is only necessary if suggestions were pulled from a db or api
  getSuggestions = debounce((callback, e) => {
    const suggestions = callback(e.target.value);
    this.renderSuggestions(suggestions, e);
  }, 250);

  bindOnInputChange(callback) {
    this.input.addEventListener('input', (e) => {
      this.resetSuggestionContainer();
      // callback gets matching manufacturers from model
      this.getSuggestions(callback, e);
    });
  }

  // bindSuggestionSelectionEvent
  bindAutoSuggestionEvent(callback) {
    document.addEventListener('click', (e) => {
      if (e.target.dataset.type === 'suggestion') {
        this.resetSuggestionContainer();
        // sets input value to auto suggestion text content
        // focuses input so user can hit enter and submit guess
        // []this is currently following UX of worldle but potentially makes more sense
        // to automatically submit guess on auto suggestion click
        callback(e.target.textContent);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.dataset.type === 'suggestion') {
        this.resetSuggestionContainer();
        callback(e.target.textContent);
      }
    });
  }

  bindGuessInput(callback) {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (e.target.value === '') return;
        this.resetSuggestionContainer();
        // callback is handler for game flow, error handling, win/loss conditions etc
        callback(e.target.value);
        this.resetInput(e);
      }
    });
  }
}
