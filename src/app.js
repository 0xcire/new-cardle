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
  // []apply input animation instead for errors and etc
  const handleGuessInput = async (input) => {
    guess.last = input;
    console.log(guess.answer);

    const handleGuessNotValid = () => {
      view.renderInvalidGuessSuggestion();
    };

    const handleAlreadyGuessed = () => {
      view.renderAlreadyGuessedSuggestion();
    };

    const handleLoss = () => {
      if (guess.getCount() === 5 && !guess.matchesAnswer()) {
        view.renderLossCard(guess.answer);
        view.renderOutOfGuesses();
        view.disableInput();
        // view.renderResetBtn();
      }
    };

    const handleWin = (manufacturer) => {
      view.renderWinCard(manufacturer);
      view.disableInput();
      // view.renderResetBtn();
    };

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

      setTimeout(() => handleLoss(), 500);
    };

    if (!guess.inList()) {
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

    handleValidGuess();
  };

  const handleSuggestionEvent = (manufacturer) => {
    view.input.value = manufacturer;
    view.input.focus();
  };

  // view.bindRestartGame(handleRestartGame)
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
