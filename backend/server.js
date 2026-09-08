const lessons = require('./lessons.json');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

async function translateText(text, targetLanguage) {
  // FAKE for now — Person 2 will hand you a real translate.js later
  return `${text} (translated to ${targetLanguage})`;
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Server is alive'));

app.get('/lesson/:id', (req, res) => {
  const lesson = lessons.find(l => l.id === req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  res.json(lesson);
});

app.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    const translated = await translateText(text, targetLanguage);
    res.json({ translatedText: translated });
  } catch (err) {
    res.status(500).json({ error: 'Translation failed', details: err.message });
  }
});

app.post('/getLesson', async (req, res) => {
  try {
    const { lessonId, targetLanguage } = req.body;
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const translated = await translateText(lesson.text, targetLanguage);
    res.json({
      original: lesson.text,
      translated: translated
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed', details: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));