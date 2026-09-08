const { textToSpeech } = require('./translate');
const fs = require('fs');

textToSpeech('सूर्य पूर्व में उगता है।', 'hi-IN').then(base64Audio => {
  fs.writeFileSync('test-output.wav', Buffer.from(base64Audio, 'base64'));
  console.log('Saved test-output.wav — play it to check');
}).catch(err => console.error('ERROR:', err.response?.data || err.message));