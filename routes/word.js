const express = require('express');
const path = require('path');
const router = express.Router();

const words = require(path.join(__dirname, '..', 'words.json'));

router.get('/', (req, res) => {
  const word = words[Math.floor(Math.random() * words.length)];
  res.json(word);
});

module.exports = router;
