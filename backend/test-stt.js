const { speechToTextTranslate } = require('./translate');

speechToTextTranslate('./sample-audio.wav')
  .then(console.log)
  .catch(err => console.error('ERROR:', err.response?.data || err.message));