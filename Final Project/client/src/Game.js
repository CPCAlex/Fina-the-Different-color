import React, {useState, useEffect} from "react" 

function Game({level, score, setScore, endGame, paused}){
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
            if(!paused){
                setTimeLeft((prev) => prev - 1);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [paused]);

    useEffect(() => {
        if (timeLeft === 0){
            //alert(`Time up! Your score: ${score}`);
            endGame();
        }
    }, [timeLeft, endGame]);

    const generateNewGame = () => {
        let colorDifference;
        switch(level){
            case 'medium':
                if(score < 10){
                    setGridSize(3);
                }
                else if(score < 20 && score >= 10){
                    setGridSize(4);
                }
                else if(score < 30 && score >= 20){
                    setGridSize(5);
                }
                else if(score < 40 && score >= 30){
                    setGridSize(6);
                }
                else{
                    setGridSize(7);
                }
                colorDifference = 130;
                break;
            case 'hard':
                if(score < 10){
                    setGridSize(4);
                }
                else if(score < 20 && score >= 10){
                    setGridSize(5);
                }
                else if(score < 30 && score >= 20){
                    setGridSize(6);
                }
                else if(score < 40 && score >= 30){
                    setGridSize(7);
                }
                else{
                    setGridSize(8);
                }
                colorDifference = 60;
                break;
            default:
                if(score < 10){
                    setGridSize(2);
                }
                else if(score < 20 && score >= 10){
                    setGridSize(3);
                }
                else if(score < 30 && score >= 20){
                    setGridSize(4);
                }
                else if(score < 40 && score >= 30){
                    setGridSize(5);
                }
                else{
                    setGridSize(6);
                }
                colorDifference = 200;
        }

        setDifferentSquare({
            row:Math.floor(Math.random() * gridSize),
            col:Math.floor(Math.random() * gridSize)
        })

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
    };

    useEffect(() => {
        generateNewGame();
      }, [level, gridSize, score]);

    /*
    useEffect(() => {
        switch(level){
            case 'easy':
                if(score < 10){
                    setGridSize(2);
                }
                else if(score < 20 && score >= 10){
                    setGridSize(3);
                }
                else if(score < 30 && score >= 20){
                    setGridSize(4);
                }
                else if(score < 40 && score >= 30){
                    setGridSize(5);
                }
                else{
                    setGridSize(6);
                }
                break;
            case 'medium':
                if(score < 10){
                    setGridSize(3);
                }
                else if(score < 20 && score >= 10){
                    setGridSize(4);
                }
                else if(score < 30 && score >= 20){
                    setGridSize(5);
                }
                else if(score < 40 && score >= 30){
                    setGridSize(6);
                }
                else{
                    setGridSize(7);
                }
                break;
            case 'hard':
                    if(score < 10){
                        setGridSize(4);
                    }
                    else if(score < 20 && score >= 10){
                        setGridSize(5);
                    }
                    else if(score < 30 && score >= 20){
                        setGridSize(6);
                    }
                    else if(score < 40 && score >= 30){
                        setGridSize(7);
                    }
                    else{
                        setGridSize(8);
                    }
                    break;
                }            
    }, [score, level]);
    */
    const handleSquareClick = (row, col, gridSize) => {
        if (paused) return;
        if (row === differentSquare.row && col === differentSquare.col){
            setScore(score + 1);  
            generateNewGame(); 
        }
        else{
            setScore(score - 1);
        }
        
    };

    return (
        <div>
            <h2>Time remaining: {timeLeft} seconds</h2>
            <h2>Current Score: {score}</h2>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${gridSize}, 50px)`, 
                gap: '5px' 
            }}>
                {Array.from({ length: gridSize }).map((_, row) =>
                    Array.from({ length: gridSize }).map((_, col) => (
                        <div
                            key={`${row}-${col}`}
                            onClick={() => handleSquareClick(row, col, gridSize)}
                            style={{
                                width: '50px', 
                                height: '50px', 
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