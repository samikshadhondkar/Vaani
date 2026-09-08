require('dotenv').config();
const axios = require('axios');

const HEADERS = {
  'api-subscription-key': process.env.TRANSLATE_API_KEY,
  'Content-Type': 'application/json'
};

async function translateText(text, sourceLanguage, targetLanguage) {
  const response = await axios.post(
    'https://api.sarvam.ai/translate',
    {
      input: text,
      source_language_code: sourceLanguage,
      target_language_code: targetLanguage,
      model: 'sarvam-translate:v1'
    },
    { headers: HEADERS }
  );
  return response.data.translated_text;
}

async function textToSpeech(text, languageCode) {
  const response = await axios.post(
    'https://api.sarvam.ai/text-to-speech',
    {
      text: text,
      target_language_code: languageCode,
      model: 'bulbul:v3',
      speaker: 'shubh'
    },
    { headers: HEADERS }
  );
  return response.data.audios[0];
}

module.exports = { translateText, textToSpeech };