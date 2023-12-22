import './app.css';

import Loader from './js/views/Loader';
import GameView from './js/views/GameView';

import Guess from './js/models/Guess';
import Location from './js/models/Location';

const state = {
  loader: new Loader(),
};

const Controller = () => {
  const guess = new Guess();
  const location = new Location();
  const view = new GameView();

  const handleOnInputChange = (currentValue) => {
    return guess.getMatchingManufacturers(currentValue);
  };

  // main game flow
  const handleGuessInput = async (input) => {
    guess.last = input;

    const handleValidGuess = async () => {
      state.loader.render();

      const guessObj = guess.inList();
      guess.addGuessToHistory(guessObj.manufacturer);

      await location.getCoordinates(guessObj.hq, guess.answer.hq);
      const distance = location.distanceBetweenGuessAnswer();
      const angle = location.angleFromGuessToAnswer();

      guess.increaseCount();

      state.loader.hide();
      view.renderValidGuessCard(guessObj.manufacturer, distance, angle);

      if (guess.checkLoss()) {
        setTimeout(() => view.displayLoss(guess.answer), 750);
      }
    };

    if (!guess.inList()) {
      view.displayInvalid();
      return;
    }
    if (guess.previouslySubmitted(input)) {
      view.displayAlreadyGuessed();
      return;
    }
    if (guess.matchesAnswer(input)) {
      view.displayWin(input);
      return;
    }

    handleValidGuess();
  };

  const handleSuggestionEvent = (manufacturer) => {
    view.input.value = '';
    view.input.focus();
    handleGuessInput(manufacturer);
  };

  const handleRestartGame = () => {
    guess.reset();
    location.reset();
    view.reset();
  };

  const handleChangeUnits = (units) => {
    location.setUnits(units);
    view.updateExistingDistances(location.convertDistance.bind(location));
  };

  view.bindOnInputChange(handleOnInputChange);
  view.bindSuggestionEvent(handleSuggestionEvent);

  view.bindGuessInput(handleGuessInput);
  view.bindRestartGame(handleRestartGame);

  view.bindToggleInstructions();
  view.bindChangeUnits(handleChangeUnits);
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
