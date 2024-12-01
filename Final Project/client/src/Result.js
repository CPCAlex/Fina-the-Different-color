import React from 'react';

function Result({ score, username }) {
  return (
    <div>
      <h2>Game Over! Your score is: {score}</h2>
      <button onClick={() => window.location.href = `/${username}`}>Return Home</button>
    </div>
  );
}

export default Result;