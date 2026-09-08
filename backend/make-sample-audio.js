const { textToSpeech } = require('./translate');
const fs = require('fs');

textToSpeech('मैं आज स्कूल जा रहा हूँ।', 'hi-IN').then(base64Audio => {
  fs.writeFileSync('sample-audio.wav', Buffer.from(base64Audio, 'base64'));
  console.log('Saved sample-audio.wav');
}).catch(err => console.error('ERROR:', err.response?.data || err.message));