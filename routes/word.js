const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const curatedWords = require(path.join(__dirname, '..', 'words.json'));
const DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const PEXELS_VIDEO_API = 'https://api.pexels.com/videos/popular';
const PEXELS_KEY = process.env.PEXELS_API_KEY || 'leDFMC0LbjxAG5mARI5f2X327gcFlgqYYBa6SgyncufkloumrVAZCYFD';

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

async function fetchBackgroundVideo() {
  try {
    const page = Math.floor(Math.random() * 30) + 1;
    const url = `${PEXELS_VIDEO_API}?per_page=1&page=${page}&min_width=1920&min_height=1080`;
    const res = await fetch(url, {
      headers: { Authorization: PEXELS_KEY },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const videos = data.videos || [];
    if (videos.length === 0) return null;
    const video = videos[0];

    // Pick the highest quality video file (prefer 4k or 2k, fall back to hd)
    const files = video.video_files || [];
    // Sort by quality: higher height = better
    files.sort((a, b) => (b.height || 0) - (a.height || 0));
    const best = files[0];
    if (!best || !best.link) return null;

    return {
      src: best.link,
      photographer: video.user?.name || null,
      url: video.url || null,
      width: best.width,
      height: best.height,
    };
  } catch {
    return null;
  }
}

router.get('/', async (req, res) => {
  let result;

  // Try to serve a cached word first for speed
  const cached = [...cache.values()];
  if (cached.length > 30 && Math.random() < 0.3) {
    result = cached[Math.floor(Math.random() * cached.length)];
  }

  if (!result) {
    // Pick a new random word and look it up
    for (let attempt = 0; attempt < 5; attempt++) {
      const word = pickRandomWord();
      if (cache.has(word)) continue;
      try {
        result = await fetchFromDictionary(word);
        cache.set(word, result);
        break;
      } catch {
        continue;
      }
    }
  }

  // Fallback
  if (!result) result = pickRandomCurated();

  // Attach background video from Pexels
  const bg = await fetchBackgroundVideo();
  if (bg) {
    result.background = bg.src;
    result.backgroundType = 'video';
    result.photographer = bg.photographer;
    result.photoUrl = bg.url;
  }

  res.json(result);
});

module.exports = router;
