import './app.css';

import Loader from './js/views/Loader';
import GuessView from './js/views/GuessView';

import Guess from './js/models/Guess';
import Geocode from './js/models/Geocode';

// this is not right
const state = {
  loader: new Loader(),
};

const Controller = () => {
  const guess = new Guess();
  const geocode = new Geocode();

  const view = new GuessView();

  const handleOnInputChange = (value) => {
    return guess.getMatchingManufacturers(value);
  };

  // main game flow
  // []remove loader for all guesses - only needed for 'validGuess'
  // []apply input animation instead for errors and etc
  const handleGuessInput = async (input) => {
    // state.loader.render();
    // removing any spaces and capitalizations
    guess.last = input;
    console.log(guess.answer);

    // opportunity for custom events here? for all these handle{x} cases
    // [x]
    const handleGuessNotValid = () => {
      state.loader.hide();
      view.renderInvalidGuessError();
    };

    // [x]
    const handleAlreadyGuessed = () => {
      state.loader.hide();
      view.renderAlreadyGuessedError();
    };

    const handleOutOfGuesses = (manufacturer) => {
      state.loader.hide();
      view.renderLossCard(manufacturer);
      view.renderOutOfGuesses();
      view.disableInput();
    };

    const handleWin = (manufacturer) => {
      state.loader.hide();
      view.renderWinCard(manufacturer);
      view.disableInput();
    };

    const handleValidGuess = async () => {
      const guessObj = guess.inList();
      console.log(guessObj);
      guess.addGuessToHistory(guessObj.manufacturer);

      await geocode.getCoordinates(guessObj.hq, guess.answer.hq);
      const distance = geocode.distanceBetweenGuessAnswer();
      const angle = geocode.angleFromGuessToAnswer();
      console.log('view.renderGuessCard()');

      guess.increaseCount();
      state.loader.hide();
      view.renderValidGuessCard(guessObj.manufacturer, distance, angle);
    };

    // this shouldnt be run on 6th guess,
    // if 5th guess
    // and 5th guess does not match
    // run below[]
    if (guess.getCount(input) >= 5) {
      handleOutOfGuesses(input);
      return;
    }
    if (guess.inList() === undefined) {
      handleGuessNotValid();
      return;
    }
    if (guess.previouslySubmitted(input)) {
      handleAlreadyGuessed();
      return;
    }
    if (guess.matchesAnswer(input)) {
      handleWin(input);
      return;
    }
    // default behavior is rendering a guess card that displays
    // 'how wrong' you were
    handleValidGuess();
  };

  const handleAutoSuggestionEvent = (value) => {
    view.input.value = value;
    view.input.focus();
  };

  // view.bindRestartGame(handleRestartGame)
  view.bindAutoSuggestionEvent(handleAutoSuggestionEvent);
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
