const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const curatedWords = require(path.join(__dirname, '..', 'words.json'));
const DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const PEXELS_KEY = process.env.PEXELS_API_KEY || 'leDFMC0LbjxAG5mARI5f2X327gcFlgqYYBa6SgyncufkloumrVAZCYFD';
const PEXELS_PHOTO_API = 'https://api.pexels.com/v1/search';
const PEXELS_VIDEO_API = 'https://api.pexels.com/videos/search';
const FETCH_TIMEOUT = 4000;
const DAILY_BATCH_SIZE = 50;

// ─── Word list ───
const wordList = fs
  .readFileSync(path.join(__dirname, '..', 'words.txt'), 'utf-8')
  .split('\n')
  .filter(Boolean);

// ─── Caches ───
const defCache = new Map();   // word → { word, phonetic, definition, … }
const mediaCache = new Map(); // word → { src, photographer, url, type }

// Seed definition cache with curated words
for (const w of curatedWords) {
  defCache.set(w.word, w);
}

// ─── Seeded PRNG (Mulberry32) ───
function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h) + seed.charCodeAt(i);
    h |= 0;
  }
  return function () {
    h |= 0;
    h = h + 0x6D2B79F5 | 0;
    let t = Math.imul(h ^ h >>> 15, 1 | h);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ─── Daily word pool (50 unique words, date-rotated) ───
let dailyPool = null;
let dailyPoolDate = '';

function getDailyPool() {
  const today = new Date().toISOString().slice(0, 10); // "2026-07-03"
  if (dailyPoolDate !== today) {
    const rng = seededRandom(today);
    const pool = [...wordList];
    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    dailyPool = pool.slice(0, DAILY_BATCH_SIZE);
    dailyPoolDate = today;
  }
  return dailyPool;
}

// ─── HTTP fetch with timeout ───
async function fetchJSON(url, opts, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms || FETCH_TIMEOUT);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ─── Dictionary API lookup (cached) ───
async function getDefinition(word) {
  if (defCache.has(word)) return defCache.get(word);
  const data = await fetchJSON(`${DICT_API}/${encodeURIComponent(word)}`);
  if (!data || !Array.isArray(data)) return null;
  const entry = data[0];
  if (!entry) return null;
  const phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || '';
  const audioUrl = entry.phonetics?.find(p => p.audio)?.audio || null;
  const meaning = entry.meanings?.[0];
  const result = {
    word,
    phonetic,
    definition: meaning?.definitions?.[0]?.definition || '',
    example: meaning?.definitions?.[0]?.example || '',
    partOfSpeech: meaning?.partOfSpeech || '',
    audioUrl,
  };
  defCache.set(word, result);
  return result;
}

// ─── Single Pexels media fetch ───
async function fetchSingleMedia() {
  const useVideo = Math.random() < 0.5;
  const page = Math.floor(Math.random() * 30) + 1;

  if (useVideo) {
    const data = await fetchJSON(
      `${PEXELS_VIDEO_API}?query=nature&orientation=landscape&per_page=1&page=${page}&min_width=1920&min_height=1080`,
      { headers: { Authorization: PEXELS_KEY } },
      3000
    );
    if (data?.videos?.[0]) {
      const v = data.videos[0];
      const files = (v.video_files || []).sort((a, b) => (b.height || 0) - (a.height || 0));
      if (files[0]?.link) {
        return { src: files[0].link, photographer: v.user?.name || null, url: v.url || null, type: 'video' };
      }
    }
  }

  // Photo (or video fallback)
  const data = await fetchJSON(
    `${PEXELS_PHOTO_API}?query=nature&orientation=landscape&per_page=1&page=${page}`,
    { headers: { Authorization: PEXELS_KEY } },
    3000
  );
  if (data?.photos?.[0]) {
    const p = data.photos[0];
    return { src: p.src?.original || p.src?.large2x || null, photographer: p.photographer || null, url: p.url || null, type: 'photo' };
  }
  return null;
}

// ─── Background batch media pre-fetch ───
let mediaGenerationPromise = null;

async function preFetchBatchMedia() {
  const pool = getDailyPool();
  for (const word of pool) {
    if (mediaCache.has(word)) continue;
    try {
      const media = await fetchSingleMedia();
      if (media) mediaCache.set(word, media);
    } catch { /* skip failed fetches */ }
  }
}

function startBackgroundPreFetch() {
  if (!mediaGenerationPromise) {
    mediaGenerationPromise = preFetchBatchMedia().finally(() => {
      mediaGenerationPromise = null;
    });
  }
}

// ─── GET /api/word?s=N ───
router.get('/', async (req, res) => {
  const pool = getDailyPool();

  // Read slot from query param (client stores in localStorage)
  let slot = parseInt(req.query.slot, 10);
  if (isNaN(slot) || slot < 0 || slot >= DAILY_BATCH_SIZE) slot = 0;

  const wordName = pool[slot];
  const nextSlot = (slot + 1) % DAILY_BATCH_SIZE;

  // Resolve definition (cached → Dictionary API → random curated fallback)
  let result = await getDefinition(wordName);
  if (!result) {
    // Quick fallback: show the word with just a placeholder definition
    const fb = curatedWords[Math.floor(Math.random() * curatedWords.length)];
    result = { word: wordName, definition: fb.definition, phonetic: '', example: '', partOfSpeech: '', audioUrl: null };
  }

  // Attach pre-fetched media if available
  const media = mediaCache.get(wordName);
  if (media) {
    result.background = media.src;
    result.backgroundType = media.type;
    result.photographer = media.photographer;
    result.photoUrl = media.url;
  } else {
    // No cached media yet — try a quick synchronous fetch
    try {
      const live = await fetchSingleMedia();
      if (live) {
        mediaCache.set(wordName, live);
        result.background = live.src;
        result.backgroundType = live.type;
        result.photographer = live.photographer;
        result.photoUrl = live.url;
      }
    } catch { /* render without media */ }
  }

  // Fire background pre-fetch for rest of batch (non-blocking)
  startBackgroundPreFetch();

  // Return word data + nextSlot so client can store it
  result.nextSlot = nextSlot;
  res.json(result);
});

module.exports = router;
