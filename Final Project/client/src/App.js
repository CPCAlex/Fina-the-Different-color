import React, {useEffect, useState} from 'react'
import Game from './Game';

function App() {
  const [level, setLevel] = useState('easy');
  const [score, setScore] = useState(0);

  return (
    <div>
      <h1>Find the Different color</h1>
      <select onChange={(e) => setLevel(e.target.value)}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <Game level={level} score={score} setScore={setScore} />
    </div>
  );
}


export default App


