import './app.css';

// import elements from './js/views/DOM';
import Loader from './js/views/Loader';

import Guess from './js/models/Guess';
import GuessView from './js/views/GuessView';
// import Manufacturers from './js/models/Manufacturer';

// this is not right
const state = {
  loader: new Loader(),
};

const Controller = () => {
  const guess = new Guess();
  const view = new GuessView();

  const handleOnInputChange = (value) => {
    return guess.getMatchingManufacturers(value);
  };

  const handleGuessInput = (input) => {
    guess.increaseCount();
    // view.render();
    state.loader.render();
    // simulating load again || only really need when renderguess card is implemented
    setTimeout(() => {
      if (guess.getCount() > 5) {
        console.log('view.renderRanOutOfGuesses()');
        state.loader.hide();
        return;
      } else if (guess.matchesAnswer(input)) {
        console.log('view.renderWinCard()');
      } else {
        console.log('view.renderGuessCard()');
      }
      state.loader.hide();
    }, 500);
  };

  const handleSuggestionEvent = (value) => {
    view.input.value = value;
    view.input.focus();
  };

  view.bindSuggestionEvent(handleSuggestionEvent);
  view.bindOnInputChange(handleOnInputChange);
  view.bindGuessInput(handleGuessInput);
};

document.addEventListener('DOMContentLoaded', async () => {
  state.loader.init();
  // simulating load
  await new Promise((resolve) => {
    setTimeout(() => {
      state.loader.hide();
      resolve();
    }, 1000);
  });
  Controller();
});
