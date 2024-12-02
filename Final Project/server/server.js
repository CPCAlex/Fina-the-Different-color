const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

app.use(cors());
app.use(bodyParser.json());

// make sure to have the table Data inside of your database
const connection = mysql.createConnection({
  host: 'localhost',  
  user: 'root', //change the user as needed       
  password: 'password', //change the password as needed
  database: 'myApp' // change the database name as needed  
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

app.post('/api/score', (req, res) => {
  const { username, difficulty, score } = req.body;

  const query = 'INSERT INTO Data (username, difficulty, score) VALUES (?, ?, ?)';

  connection.query(query, [username, difficulty, score], (err, results) => {
    if (err) {
      console.error('Error saving data:', err);
      return res.status(500).send('Error saving data');
    }
    res.status(201).json({ message: 'Data saved successfully', data: { username, difficulty, score } });
  });
});


app.get('/api/data', (req, res) => {
  const query = 'SELECT * FROM Data'; 
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data');
    }
    res.json(results); 
  });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
