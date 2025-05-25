const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = 'db.json';

// Initialize db.json if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ history: [] }, null, 2));
}

// Read history from db
function readHistory() {
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data).history;
}

// Write history to db
function writeHistory(history) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ history }, null, 2));
}

// API: Get history
app.get('/api/history', (req, res) => {
    const history = readHistory();
    res.json(history);
});

// API: Add new calculation
app.post('/api/calculate', (req, res) => {
    const { expression, result } = req.body;
    if (!expression || typeof result !== 'number') {
        return res.status(400).json({ error: 'Invalid input' });
    }
    const history = readHistory();
    const newEntry = { expression, result, timestamp: new Date().toISOString() };
    history.push(newEntry);
    writeHistory(history);
    res.status(201).json(newEntry);
});

// Serve frontend
app.use(express.static('frontend'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
