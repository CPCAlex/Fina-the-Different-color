import React, { useState, useEffect } from 'react';
import Game from './Game';
import Result from './Result';
import './App.css'; 

function App() {
  const [level, setLevel] = useState('easy');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [username, setUsername] = useState('guest');
  const [data, setData] = useState([]);
  const [loginMessage, setLoginMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const startGame = () => {
    setScore(0);
    setGameStarted(true);
    setGameEnded(false);
    setPaused(false);
  };

  const endGame = () => {
    setGameStarted(false);
    setGameEnded(true);

    fetch('http://localhost:5000/api/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        difficulty: level,
        score: score,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log('Data saved to database:', data))
      .catch((error) => console.error('Error saving data:', error));
  };

  const handleLogin = (name) => {
    setUsername(name);
    setLoginMessage('Username saved successfully!');
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameEnded(false);
    setScore(0);
    setPaused(false);
  };

  return (
    <div className="App">
      <h1>Find the Different Color</h1>
      {!gameStarted && !gameEnded && (
        <div className="game-controls">
          <select onChange={(e) => setLevel(e.target.value)} className="level-selector">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button onClick={startGame} className="btn start-btn">Start Game</button>
          <button onClick={() => handleLogin(prompt('Please input username'))} className="btn login-btn">Login</button>
          {loginMessage && <p className="login-message">{loginMessage}</p>}
        </div>
      )}

      {gameStarted && (
        <Game level={level} score={score} setScore={setScore} endGame={endGame} paused = {paused}/>
      )}

      {gameStarted && (
        <div>
          <button onClick={togglePause} className="btn pause-btn">{paused ? 'Continue' : 'Pause'}</button>
          <button onClick={resetGame} className="btn restart-btn">Restart</button>
        </div>
      )}

      {gameEnded && (
        <Result score={score} username={username} />
      )}

      <h2>Previous Game Data</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Difficulty</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.username}</td>
              <td>{item.difficulty}</td>
              <td>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
