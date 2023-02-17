import { debounce } from '../utils/utils';

export default class gameView {
  constructor() {
    this.input = document.querySelector('#guess-input');
    this.suggestionContainer = document.querySelector('.suggestions');
    this.guessContainer = document.querySelector('.guesses');
    this.restartBtn = document.querySelector('.fa-rotate');
    this.infoContainer = document.querySelector('.info-settings');
    this.instructionsBtn = document.querySelector('.fa-gear');
    this.unitOptions = document.querySelectorAll('#units option');
  }

  reset() {
    this.clearGuesses();
    this.enableInput();
    this.resetSuggestionContainer();
    this.restartBtn.style.display = 'none';
  }

  resetInput() {
    this.input.value = '';
  }

  disableInput() {
    this.input.disabled = true;
  }

  enableInput() {
    this.input.disabled = false;
  }

  resetSuggestionContainer() {
    this.suggestionContainer.innerHTML = '';
  }

  inputShake() {
    this.input.classList.remove('input-shake');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.input.classList.add('input-shake');
      });
    });
  }

  static Suggestion(args) {
    const container = document.createElement('button');
    container.classList.add('suggestion');

    if (args?.type === 'error') {
      container.classList.add('suggestion-error');
      container.tabIndex = '-1';
    } else if (args?.type === 'suggestion') {
      container.dataset.type = 'suggestion';
    }

    return container;
  }

  static GuessCard() {
    const container = document.createElement('div');
    container.classList.add('guess');

    const name = document.createElement('p');
    name.classList.add('name');

    container.appendChild(name);
    return container;
  }

  createSuggestionCard(suggestion) {
    const container = this.constructor.Suggestion({ type: 'suggestion' });
    container.textContent = suggestion.manufacturer;
    this.suggestionContainer.appendChild(container);
  }

  renderInvalidGuessSuggestion() {
    const container = this.constructor.Suggestion({ type: 'error' });
    container.textContent = 'not a manufacturer';
    this.suggestionContainer.appendChild(container);
  }

  renderAlreadyGuessedSuggestion() {
    const container = this.constructor.Suggestion({ type: 'error' });
    container.textContent = 'already guessed';
    this.suggestionContainer.appendChild(container);
  }

  renderOutOfGuesses() {
    const container = this.constructor.Suggestion({ type: 'error' });
    container.textContent = `out of guesses`;
    this.suggestionContainer.appendChild(container);
  }

  renderWinCard(manufacturer) {
    const container = this.constructor.GuessCard();
    container.classList.add('guess-correct');

    container.firstElementChild.textContent = `${manufacturer} is correct!`;
    this.guessContainer.insertAdjacentElement('afterbegin', container);
  }

  renderLossCard(answer) {
    const container = this.constructor.GuessCard();
    container.classList.add('guess-loss');

    container.firstElementChild.textContent = `${answer.manufacturer} was correct!`;
    this.guessContainer.insertAdjacentElement('afterbegin', container);
  }

  renderValidGuessCard(guess, dist, ang) {
    const container = this.constructor.GuessCard();
    container.firstElementChild.textContent = guess;

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

    container.appendChild(indicators);
    this.guessContainer.insertAdjacentElement('afterbegin', container);
  }

  renderRestartBtn() {
    this.restartBtn.style.display = 'block';
  }

  clearGuesses() {
    this.guessContainer.innerHTML = '';
  }

  // will create own api to fit my needs in future
  // for now this debounce is rather useless
  renderSuggestions = debounce((callback, e) => {
    if (e.target.value === '') return;
    const suggestions = callback(e.target.value);
    suggestions.forEach((suggestion) => {
      this.createSuggestionCard(suggestion);
    });
  }, 150);

  toggleInfoSettingsPanel() {
    this.infoContainer.classList.toggle('info-settings-hidden');
    this.infoContainer.classList.toggle('info-settings-shown');
  }

  bindOnInputChange(callback) {
    this.input.addEventListener('input', (e) => {
      this.resetSuggestionContainer();
      this.renderSuggestions(callback, e);
    });
  }

  // bindSuggestionSelectionEvent
  // callback: sets input value and re-focuses
  bindSuggestionEvent(callback) {
    document.addEventListener('click', (e) => {
      if (e.target.dataset.type === 'suggestion') {
        this.resetSuggestionContainer();
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

  bindRestartGame(callback) {
    this.restartBtn.addEventListener('click', () => {
      callback();
    });
    this.restartBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        callback();
      }
    });
  }

  bindToggleInstructions() {
    this.instructionsBtn.addEventListener('click', () => {
      this.toggleInfoSettingsPanel();
    });
  }

  bindChangeUnits(callback) {
    this.unitOptions.forEach((option) => {
      option.addEventListener('click', (e) => {
        callback(e.target.value);
      });
    });
  }
}
