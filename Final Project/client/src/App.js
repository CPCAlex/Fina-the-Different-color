import React, {useEffect, useState} from 'react'
import Game from './Game';
import Result from './Result';

function App() {
  const [level, setLevel] = useState('easy');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [username, setUsername] = useState('guest');
  const startGame = () => {
    setScore(0);
    setGameStarted(true);
    setGameEnded(false);
    setPaused(false);
  };

  const endGame = () => {
    setGameStarted(false);
    setGameEnded(true);
  };

  
  
  const handleLogin = (name) => {
    setUsername(name);
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

  /*useEffect(() => {
    fetch('http://localhost:5000/api')
      .then(response => response.json())
      .then(data => console.log(data));
  }, []);*/

  useEffect(() => {
    fetch('http://localhost:5000/api')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => console.log(data))
      .catch(error => console.error('Fetch error:', error));
  }, []);

  return (
    <div>
      <h1>Find the Different color</h1>
      {!gameStarted && !gameEnded && (
        <div>
          <select onChange={(e) => setLevel(e.target.value)}>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
          <button onClick={startGame}>Start Game</button>
          <button onClick={() => handleLogin(prompt('Please input username'))}>Login</button>
        </div>
      )}
      {gameStarted && (
        <Game level={level} score={score} setScore={setScore} endGame={endGame} />
      )}
      {gameStarted && (
        <div>
          <button onClick={togglePause} > {paused ? 'continue' : 'pause'}</button>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
      {gameEnded && (
        <Result score={score} username = {username}/>
      )}
    </div>
  )
}


export default App


