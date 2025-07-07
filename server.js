
const express = require('express');
const path = require('path');
const wordRoute = require('./routes/word');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/word', wordRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/archive', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/archive.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
