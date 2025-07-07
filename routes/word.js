
const express = require('express');
const router = express.Router();

const wordData = {
    "date": "2025-07-06",
    "word": "ephemeral",
    "definition": "lasting for a very short time",
    "example": "Life is as ephemeral as morning dew.",
    "audioUrl": "/audio/ephemeral.mp3"
};

router.get('/', (req, res) => {
    res.json(wordData);
});

module.exports = router;
