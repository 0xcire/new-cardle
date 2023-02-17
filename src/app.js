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
        view.renderRestartBtn();
      }
    };

    const handleWin = (manufacturer) => {
      view.renderWinCard(manufacturer);
      view.disableInput();
      view.renderRestartBtn();
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

  const handleRestartGame = () => {
    guess.reset();
    location.reset();
    view.reset();
  };

  const handleChangeUnits = (units) => {
    if (units === location.units) return;

    if (units === 'km') {
      location.setUnits(units);
    } else {
      location.setUnits(units);
    }

    const currentGuesses = view.guessContainer.children;
    if (currentGuesses.length > 0) {
      for (let i = 0; i < currentGuesses.length; i += 1) {
        const distanceEl = currentGuesses[i].children[1].children[0];
        const distance = distanceEl.textContent.split(' ')[0];
        distanceEl.textContent = `${location.convertDistance(
          distance
        )} ${units}`;
      }
    }

    view.toggleInfoSettingsPanel();
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
