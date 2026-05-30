const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const curatedWords = require(path.join(__dirname, '..', 'words.json'));
const DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const PEXELS_KEY = process.env.PEXELS_API_KEY || 'leDFMC0LbjxAG5mARI5f2X327gcFlgqYYBa6SgyncufkloumrVAZCYFD';

const PEXELS_PHOTO_API = 'https://api.pexels.com/v1/search';
const PEXELS_VIDEO_API = 'https://api.pexels.com/videos/search';

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

async function fetchPhoto() {
  const page = Math.floor(Math.random() * 30) + 1;
  // Nature landscape photos
  const url = `${PEXELS_PHOTO_API}?query=nature&orientation=landscape&per_page=1&page=${page}`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!res.ok) return null;
  const data = await res.json();
  const photo = data.photos?.[0];
  if (!photo) return null;
  return {
    src: photo.src?.original || photo.src?.large2x || null,
    photographer: photo.photographer || null,
    url: photo.url || null,
    type: 'photo',
  };
}

async function fetchVideo() {
  const page = Math.floor(Math.random() * 20) + 1;
  // Nature landscape videos
  const url = `${PEXELS_VIDEO_API}?query=nature&orientation=landscape&per_page=1&page=${page}&min_width=1920&min_height=1080`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!res.ok) return null;
  const data = await res.json();
  const videos = data.videos || [];
  if (videos.length === 0) return null;
  const video = videos[0];
  const files = video.video_files || [];
  files.sort((a, b) => (b.height || 0) - (a.height || 0));
  const best = files[0];
  if (!best || !best.link) return null;
  return {
    src: best.link,
    photographer: video.user?.name || null,
    url: video.url || null,
    type: 'video',
  };
}

router.get('/', async (req, res) => {
  let result;

  // Try to serve a cached word first for speed
  const cached = [...cache.values()];
  if (cached.length > 30 && Math.random() < 0.3) {
    result = cached[Math.floor(Math.random() * cached.length)];
  }

  if (!result) {
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

  if (!result) result = pickRandomCurated();

  // Randomly pick photo or video (50/50)
  const useVideo = Math.random() < 0.5;
  const bg = useVideo ? await fetchVideo() : await fetchPhoto();

  // Fallback to the other type if first attempt failed
  if (!bg) {
    const fallback = useVideo ? await fetchPhoto() : await fetchVideo();
    if (fallback) {
      result.background = fallback.src;
      result.backgroundType = fallback.type;
      result.photographer = fallback.photographer;
      result.photoUrl = fallback.url;
    }
  } else {
    result.background = bg.src;
    result.backgroundType = bg.type;
    result.photographer = bg.photographer;
    result.photoUrl = bg.url;
  }

  res.json(result);
});

module.exports = router;
