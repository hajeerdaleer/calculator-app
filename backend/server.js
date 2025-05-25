
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: 'postgresql://calculator_app_user:qwUyJcITiVTfzh6DfJHZpZsG7NmOoxPM@dpg-d0pcajeuk2gs739ftoo0-a.oregon-postgres.render.com/calculator_app',
    ssl: { rejectUnauthorized: false }
});

pool.query(`CREATE TABLE IF NOT EXISTS history (
    id SERIAL PRIMARY KEY,
    expression TEXT NOT NULL,
    result TEXT NOT NULL
)`);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/calculate', async (req, res) => {
    const { expression, result } = req.body;
    await pool.query('INSERT INTO history(expression, result) VALUES($1, $2)', [expression, result]);
    res.sendStatus(200);
});

app.get('/history', async (req, res) => {
    const result = await pool.query('SELECT expression, result FROM history ORDER BY id DESC LIMIT 10');
    res.json(result.rows);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
