const lessons = require('./lessons.json');
const { translateText } = require('./translate');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Fake translation function removed.
// Using real translateText from translate.js

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

    const translated = await translateText(
      text,
      'en-IN',
      targetLanguage
    );

    res.json({ translatedText: translated });
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

    const translated = await translateText(
      lesson.text,
      'en-IN',
      targetLanguage
    );

    res.json({
      original: lesson.text,
      translated: translated
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed',
      details: err.message
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});