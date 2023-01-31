import './app.css';

document.addEventListener('click', () => {
  console.log('🤖 loading...');
});

document.querySelector('#guess-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    console.log(e.target.value);
    e.target.value = '';
  }
});
