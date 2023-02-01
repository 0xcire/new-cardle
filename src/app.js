import './app.css';

import elements from './js/views/DOM';
import Loader from './js/views/Loader';

const state = {
  loader: new Loader(elements.loaderContainer, elements.svgPaths),
};

document.querySelector('#guess-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.target.value = '';
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  state.loader.init();
  // simulating load
  const load = await new Promise((resolve) => {
    setTimeout(() => {
      state.loader.hide();
      resolve();
    }, 1000);
  });
});
