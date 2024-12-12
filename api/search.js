const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());

app.get('/api/search', (req, res) => {
    const { keyword } = req.query;

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    // Example: Generate mock emails (replace this with real scraping logic if needed)
    const emails = [
        `${keyword}1@example.com`,
        `${keyword}2@example.com`,
        `${keyword}3@example.com`,
    ];

    res.json({ emails });
});

module.exports = app;
