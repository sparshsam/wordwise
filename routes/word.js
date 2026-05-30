const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const curatedWords = require(path.join(__dirname, '..', 'words.json'));
const DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const PEXELS_KEY = process.env.PEXELS_API_KEY || 'leDFMC0LbjxAG5mARI5f2X327gcFlgqYYBa6SgyncufkloumrVAZCYFD';
const PEXELS_PHOTO_API = 'https://api.pexels.com/v1/search';
const PEXELS_VIDEO_API = 'https://api.pexels.com/videos/search';
const FETCH_TIMEOUT_MS = 4000;

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

// Fetch with timeout
async function fetchWithTimeout(url, opts, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms || FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFromDictionary(word) {
  const res = await fetchWithTimeout(`${DICT_API}/${encodeURIComponent(word)}`);
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

async function tryFetchBackground() {
  try {
    const useVideo = Math.random() < 0.5;
    const page = Math.floor(Math.random() * 30) + 1;
    let src, photographer, url, type;

    if (useVideo) {
      const apiUrl = `${PEXELS_VIDEO_API}?query=nature&orientation=landscape&per_page=1&page=${page}&min_width=1920&min_height=1080`;
      const res = await fetchWithTimeout(apiUrl, { headers: { Authorization: PEXELS_KEY } }, 3000);
      if (res.ok) {
        const data = await res.json();
        const video = data.videos?.[0];
        if (video) {
          const files = (video.video_files || []).sort((a, b) => (b.height || 0) - (a.height || 0));
          const best = files[0];
          if (best?.link) {
            src = best.link;
            photographer = video.user?.name || null;
            url = video.url || null;
            type = 'video';
          }
        }
      }
      // If video failed, try photo
      if (!src) {
        const photoUrl = `${PEXELS_PHOTO_API}?query=nature&orientation=landscape&per_page=1&page=${page}`;
        const pRes = await fetchWithTimeout(photoUrl, { headers: { Authorization: PEXELS_KEY } }, 3000);
        if (pRes.ok) {
          const pData = await pRes.json();
          const photo = pData.photos?.[0];
          if (photo) {
            src = photo.src?.original || photo.src?.large2x || null;
            photographer = photo.photographer || null;
            url = photo.url || null;
            type = 'photo';
          }
        }
      }
    } else {
      const photoUrl = `${PEXELS_PHOTO_API}?query=nature&orientation=landscape&per_page=1&page=${page}`;
      const res = await fetchWithTimeout(photoUrl, { headers: { Authorization: PEXELS_KEY } }, 3000);
      if (res.ok) {
        const data = await res.json();
        const photo = data.photos?.[0];
        if (photo) {
          src = photo.src?.original || photo.src?.large2x || null;
          photographer = photo.photographer || null;
          url = photo.url || null;
          type = 'photo';
        }
      }
    }

    if (src) return { src, photographer, url, type };
  } catch {}
  return null;
}

router.get('/', async (req, res) => {
  let result;

  // Serve a cached word ASAP — curated words are always pre-cached
  const cached = [...cache.values()];
  if (cached.length > 30) {
    // 50% chance to serve cached instantly (no external API calls)
    if (Math.random() < 0.5) {
      result = cached[Math.floor(Math.random() * cached.length)];
    }
  }

  if (!result) {
    // Try up to 3 times to get a NEW word from dictionary (with timeout)
    for (let attempt = 0; attempt < 3; attempt++) {
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

  // If everything failed, just use a curated word — instant
  if (!result) result = pickRandomCurated();

  // Fire background fetch in parallel but don't wait long
  const bg = await tryFetchBackground();
  if (bg) {
    result.background = bg.src;
    result.backgroundType = bg.type;
    result.photographer = bg.photographer;
    result.photoUrl = bg.url;
  }

  res.json(result);
});

module.exports = router;
