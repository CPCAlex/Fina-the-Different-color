import React, { useState, useEffect } from "react";

function Game({ level, score, setScore, endGame, paused }) {
  const [gridSize, setGridSize] = useState(2);
  const [differentSquare, setDifferentSquare] = useState({
    row: Math.floor(Math.random() * gridSize),
    col: Math.floor(Math.random() * gridSize),
  });
  const [timeLeft, setTimeLeft] = useState(60);

  const [baseColor, setBaseColor] = useState({ r: 0, g: 0, b: 0 });
  const [diffColor, setDiffColor] = useState({ r: 0, g: 0, b: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, endGame]);

  const generateNewGame = () => {
    let colorDifference;
    switch (level) {
      case "medium":
        if (score < 10) {
          setGridSize(3);
        } else if (score < 20 && score >= 10) {
          setGridSize(4);
        } else if (score < 30 && score >= 20) {
          setGridSize(5);
        } else if (score < 40 && score >= 30) {
          setGridSize(6);
        } else {
          setGridSize(7);
        }
        colorDifference = 130;
        break;
      case "hard":
        if (score < 10) {
          setGridSize(4);
        } else if (score < 20 && score >= 10) {
          setGridSize(5);
        } else if (score < 30 && score >= 20) {
          setGridSize(6);
        } else if (score < 40 && score >= 30) {
          setGridSize(7);
        } else {
          setGridSize(8);
        }
        colorDifference = 60;
        break;
      default:
        if (score < 10) {
          setGridSize(2);
        } else if (score < 20 && score >= 10) {
          setGridSize(3);
        } else if (score < 30 && score >= 20) {
          setGridSize(4);
        } else if (score < 40 && score >= 30) {
          setGridSize(5);
        } else {
          setGridSize(6);
        }
        colorDifference = 200;
    }

    setDifferentSquare({
      row: Math.floor(Math.random() * gridSize),
      col: Math.floor(Math.random() * gridSize),
    });

    const baseColor = {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    };

    const diffColor = { ...baseColor };
    let remainingDifference = colorDifference;

    const direction = {
      r: Math.random() < 0.5 ? -1 : 1,
      g: Math.random() < 0.5 ? -1 : 1,
      b: Math.random() < 0.5 ? -1 : 1,
    };

    while (remainingDifference > 0) {
      const channel = ["r", "g", "b"][Math.floor(Math.random() * 3)];
      const change = Math.min(
        remainingDifference,
        Math.floor(Math.random() * (remainingDifference + 1))
      );
      diffColor[channel] = Math.min(255, Math.max(0, diffColor[channel] + direction[channel] * change));
      remainingDifference -= change;
    }

    setBaseColor(baseColor);
    setDiffColor(diffColor);
  };

  useEffect(() => {
    if (timeLeft === 60) {
      generateNewGame();
    }
  }, [level, gridSize, score, timeLeft]);

  const handleSquareClick = (row, col) => {
    if (paused) return;
    if (row === differentSquare.row && col === differentSquare.col) {
      setScore(score + 1);
      generateNewGame();
    } else {
      setScore(score - 1);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.game}>
        <h2>Time remaining: {timeLeft} seconds</h2>
        <h2>Current Score: {score}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, 100px)`,
            gap: "5px",
            justifyItems: "center",
            alignItems: "start"
          }}
        >
          {Array.from({ length: gridSize }).map((_, row) =>
            Array.from({ length: gridSize }).map((_, col) => (
              <div
                key={`${row}-${col}`}
                onClick={() => handleSquareClick(row, col)}
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor:
                    row === differentSquare.row && col === differentSquare.col
                      ? `rgb(${diffColor.r}, ${diffColor.g}, ${diffColor.b})`
                      : `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`,
                  border: "1px solid black",
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "100vh",
    textAlign: "center",
  },
  game: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

export default Game;
