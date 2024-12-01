const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

let scores = [];

app.post('/api/score', (req, res) => {
  const { score } = req.body;
  scores.push(score);
  res.status(201).send('Score recorded');
});

app.get('/api/scores', (req, res) => {
  res.json(scores);
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});