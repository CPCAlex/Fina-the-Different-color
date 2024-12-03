const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err);
    return;
  }
  console.log('Connected to SQLite database!');
});

db.run(
  `CREATE TABLE IF NOT EXISTS Data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    difficulty TEXT,
    score INTEGER
  )`,
  (err) => {
    if (err) {
      console.error('Error creating table:', err);
    }
  }
);

app.post('/api/score', (req, res) => {
  const { username, difficulty, score } = req.body;

  const query = 'INSERT INTO Data (username, difficulty, score) VALUES (?, ?, ?)';

  db.run(query, [username, difficulty, score], function (err) {
    if (err) {
      console.error('Error saving data:', err);
      return res.status(500).send('Error saving data');
    }
    res
      .status(201)
      .json({ message: 'Data saved successfully', data: { username, difficulty, score } });
  });
});

app.get('/api/data', (req, res) => {
  const { difficulty } = req.query; // Get the difficulty from the query parameters
  let query = 'SELECT * FROM Data WHERE username != "Guest"';
  const queryParams = [];

  // If a difficulty level is provided, filter by difficulty
  if (difficulty) {
    query += ' AND difficulty = ?';
    queryParams.push(difficulty);
  }

  query += ' ORDER BY score DESC';

  db.all(query, queryParams, (err, rows) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data');
    }
    res.json(rows); 
  });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
