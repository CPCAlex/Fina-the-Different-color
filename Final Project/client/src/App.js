import React, { useState, useEffect } from 'react';
import Game from './Game';
import Result from './Result';
import './App.css';

function App() {
  const [level, setLevel] = useState('Easy'); // Difficulty level for starting the game
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [username, setUsername] = useState('Guest');
  const [data, setData] = useState([]);
  const [loginMessage, setLoginMessage] = useState('');
  const [leaderboardLevel, setLeaderboardLevel] = useState('Easy'); 
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    fetch(`http://localhost:5000/api/data?difficulty=${leaderboardLevel}`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, [leaderboardLevel]); 

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
      <div className="user-display">
        <p>User: {username}</p>
      </div>
      <h1>Find the Different Color</h1>
      <h3>Developer: Peicong Cheng, Anton Yang</h3>

      {!gameStarted && !gameEnded && (
        <div className="game-controls">
          {/* Difficulty level dropdown for starting the game */}
          <select onChange={(e) => {
              setLevel(e.target.value)
            }}
            className="level-selector"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <button onClick={startGame} className="btn start-btn">Start Game</button>
          <button onClick={() => handleLogin(prompt('Please input username'))} className="btn login-btn">Login</button>
          {loginMessage && <p className="login-message">{loginMessage}</p>}
        </div>
      )}

      {gameStarted && (
        <Game level={level} score={score} setScore={setScore} endGame={endGame} paused={paused} />
      )}

      {gameStarted && (
        <div className="game-action-buttons">
          <button onClick={togglePause} className="btn pause-btn">{paused ? 'Continue' : 'Pause'}</button>
          <button onClick={resetGame} className="btn restart-btn">Restart</button>
        </div>
      )}

      {gameEnded && <Result score={score} username={username} />}

      {!gameStarted && !gameEnded && (
        <>
          <h2>Leaderboard</h2>
          <div>
            <label>
              <input
                type="radio"
                value="Easy"
                checked={leaderboardLevel === 'Easy'}
                onChange={() => setLeaderboardLevel('Easy')}
              />
              Easy
            </label>
            <label>
              <input
                type="radio"
                value="Medium"
                checked={leaderboardLevel === 'Medium'}
                onChange={() => setLeaderboardLevel('Medium')}
              />
              Medium
            </label>
            <label>
              <input
                type="radio"
                value="Hard"
                checked={leaderboardLevel === 'Hard'}
                onChange={() => setLeaderboardLevel('Hard')}
              />
              Hard
            </label>
          </div>

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
        </>
      )}
    </div>
  );
}

export default App;
