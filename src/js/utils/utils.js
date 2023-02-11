// i understand this is more redundant than useful for a project of this scale. but interesting
// also currently not even useful cause 'requests' im debouncing are from json file
export const debounce = (callback, delay) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const normalizeString = (string) =>
  string.replace(/\s/g, '').toLowerCase();
