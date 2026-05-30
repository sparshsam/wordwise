const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const curatedWords = require(path.join(__dirname, '..', 'words.json'));
const DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';

// Load large word list
const wordList = fs
  .readFileSync(path.join(__dirname, '..', 'words.txt'), 'utf-8')
  .split('\n')
  .filter(Boolean);

// In-memory cache: word → enriched data
const cache = new Map();

// Seed cache with curated words so first load is instant
for (const w of curatedWords) {
  cache.set(w.word, w);
}

function pickRandomWord() {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

function pickRandomCurated() {
  return curatedWords[Math.floor(Math.random() * curatedWords.length)];
}

async function fetchFromDictionary(word) {
  const res = await fetch(`${DICT_API}/${encodeURIComponent(word)}`);
  if (!res.ok) throw new Error('Not found');
  const data = await res.json();
  const entry = data[0];

  const phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || '';
  const audioUrl = entry.phonetics?.find(p => p.audio)?.audio || null;
  const meaning = entry.meanings?.[0];
  const definition = meaning?.definitions?.[0]?.definition || '';
  const example = meaning?.definitions?.[0]?.example || '';
  const partOfSpeech = meaning?.partOfSpeech || '';

  return { word, phonetic, definition, example, partOfSpeech, audioUrl };
}

router.get('/', async (req, res) => {
  // Try to serve a cached word first for speed
  const cached = [...cache.values()];
  if (cached.length > 30 && Math.random() < 0.3) {
    // 30% chance to serve a cached word (avoids being purely random)
    return res.json(cached[Math.floor(Math.random() * cached.length)]);
  }

  // Pick a new random word and look it up
  for (let attempt = 0; attempt < 5; attempt++) {
    const word = pickRandomWord();
    // Skip if already cached
    if (cache.has(word)) continue;

    try {
      const result = await fetchFromDictionary(word);
      cache.set(word, result);
      return res.json(result);
    } catch {
      // Word not in dictionary, try another
      continue;
    }
  }

  // Fallback: serve a curated word
  res.json(pickRandomCurated());
});

module.exports = router;
