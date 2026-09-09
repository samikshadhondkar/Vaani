const lessons = require('./lessons.json');
const { translateText, textToSpeech, processAudioChunk } = require('./translate');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Server is alive'));

app.get('/lesson/:id', (req, res) => {
  const lesson = lessons.find(l => l.id === req.params.id);

  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  res.json(lesson);
});

app.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    const translated = await translateText(text, 'en-IN', targetLanguage);
    const audioBase64 = await textToSpeech(translated, targetLanguage);

    res.json({
      translatedText: translated,
      audio: audioBase64
    });
  } catch (err) {
    res.status(500).json({
      error: 'Translation failed',
      details: err.message
    });
  }
});

app.post('/getLesson', async (req, res) => {
  try {
    const { lessonId, targetLanguage } = req.body;

    const lesson = lessons.find(l => l.id === lessonId);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const translated = await translateText(lesson.text, 'en-IN', targetLanguage);
    const audioBase64 = await textToSpeech(translated, targetLanguage);

    res.json({
      original: lesson.text,
      translated: translated,
      audio: audioBase64
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed',
      details: err.message
    });
  }
});

// Real-time voice endpoint — accepts mic audio from browser, returns translated text + speech
app.post('/api/processAudio', upload.single('audio'), async (req, res) => {
  try {
    const targetLanguage = req.body.targetLanguage;

    if (!req.file) {
      return res.status(400).json({ error: 'No audio file received' });
    }

    const audioPath = req.file.path;
    const result = await processAudioChunk(audioPath, targetLanguage);

    res.json(result);

    fs.unlink(audioPath, () => {});
  } catch (err) {
    res.status(500).json({
      error: 'Processing failed',
      details: err.message
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});