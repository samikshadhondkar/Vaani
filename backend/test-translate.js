const { translateText } = require('./translate');

translateText('I am Samiksha Dhondkar.', 'en-IN', 'hi-IN')
  .then(console.log)
  .catch(err => console.error('ERROR:', err.response?.data || err.message));