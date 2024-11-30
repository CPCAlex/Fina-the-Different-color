import React, {useState, useEffect} from "react" 

function Game({level, score, setScore}){
    const [gridSize, setGridSize] = useState(2);
    const [differentSquare, setDifferentSquare] = useState({
        row: Math.floor(Math.random() * gridSize),
        col: Math.floor(Math.random() * gridSize)
    });
    const [timeLeft, setTimeLeft] = useState(60);

    const [baseColor, setBaseColor] = useState({r:0, g:0, b:0});
    const [diffColor, setDiffColor] = useState({r:0, g:0, b:0});
    

    useEffect(()=>{
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        if (timeLeft === 0){
            alert('Time up! Your score: ${score}');
        }
    }, [timeLeft, score]);
    useEffect(() => {
        let colorDifference;
        switch(level){
            case 'medium':
                setGridSize(4);
                colorDifference = 30;
                break;
            case 'hard':
                setGridSize(6);
                colorDifference = 15;
                break;
            default:
                setGridSize(2);
                colorDifference = 50;
        }

        setDifferentSquare({
            row:Math.floor(Math.random() * gridSize),
            col:Math.floor(Math.random() * gridSize)
        }, [level, gridSize])

        const baseColor = {
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256)
        }

        const diffColor = {...baseColor};
        let remainingDifference = colorDifference;

        while (remainingDifference > 0){
            const channel = ['r', 'g', 'b'][Math.floor(Math.random() * 3)];
            const change = Math.min(remainingDifference, Math.floor(Math.random() * (remainingDifference + 1)));
            diffColor[channel] = Math.min(255, Math.max(0, diffColor[channel] + (Math.random() < 0.5 ? -change : change)));
            remainingDifference -= change;

        }

        setBaseColor(baseColor);
        setDiffColor(diffColor);
    }, [level, gridSize]);

    const handleSquareClick = (row, col) => {
        if (row === differentSquare.row && col === differentSquare.col){
            setScore(score + 1);
            
        }
        else{
            setScore(score - 1);
        }
        if(score > 10){
            setGridSize(gridSize + 1);
        }
        else if(score > 20){
            setGridSize(gridSize + 2);
        }
        else if(score > 30){
            setGridSize(gridSize + 3);
        }
        else if(score > 40){
            setGridSize(gridSize + 4);
        }
        else{
            setGridSize(gridSize + 5);
        }
    };

    return(
        <div>
        <h2>Time remainning:{timeLeft} seconds</h2>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
          {Array.from({ length: gridSize }).map((_, row) =>
            Array.from({ length: gridSize }).map((_, col) => (
              <div
                key={`${row}-${col}`}
                onClick={() => handleSquareClick(row, col)}
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: row === differentSquare.row && col === differentSquare.col
                    ? `rgb(${diffColor.r}, ${diffColor.g}, ${diffColor.b})`
                    : `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`,
                  border: '1px solid black',
                }}
              />
            ))
          )}
        </div>
      </div>
    );
}

export default Game;