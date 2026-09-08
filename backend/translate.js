require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

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
  return response.data.audios.join(''); // combine ALL audio chunks
}

async function speechToTextTranslate(audioFilePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(audioFilePath));
  form.append('model', 'saaras:v3');

  const response = await axios.post(
    'https://api.sarvam.ai/speech-to-text-translate',
    form,
    {
      headers: {
        ...form.getHeaders(),
        'api-subscription-key': process.env.TRANSLATE_API_KEY
      }
    }
  );
  return response.data.transcript;
}

async function processAudioChunk(audioFilePath, targetLanguage) {
  const englishText = await speechToTextTranslate(audioFilePath);
  const translatedText = await translateText(englishText, 'en-IN', targetLanguage);
  const audioBase64 = await textToSpeech(translatedText, targetLanguage);
  return { englishText, translatedText, audioBase64 };
}

module.exports = { translateText, textToSpeech, speechToTextTranslate, processAudioChunk };