import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" data-value={value} aria-label={value ? `Square ${value}` : 'Empty square'} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    const existingWin = calculateWinner(squares)
    if (existingWin?.winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const win = calculateWinner(squares);
  let status;
  if (win && win.winner) {
    status = 'Winner: ' + win.winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function getWinClass(line){
    if(!line) return ''
    const [a,b,c] = line
    // rows
    if (a === 0 && b === 1 && c === 2) return 'row-0'
    if (a === 3 && b === 4 && c === 5) return 'row-1'
    if (a === 6 && b === 7 && c === 8) return 'row-2'
    // cols
    if (a === 0 && b === 3 && c === 6) return 'col-0'
    if (a === 1 && b === 4 && c === 7) return 'col-1'
    if (a === 2 && b === 5 && c === 8) return 'col-2'
    // diags
    if (a === 0 && b === 4 && c === 8) return 'diag-main'
    if (a === 2 && b === 4 && c === 6) return 'diag-anti'
    return ''
  }

  const winClass = win?.line ? getWinClass(win.line) : ''

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-grid" role="grid" aria-label="Tic tac toe board">
        {Array.from({length:9}).map((_,i)=> (
          <Square key={i} value={squares[i]} onSquareClick={()=>handleClick(i)} />
        ))}
        {win?.line && (
          <div className={`win-line ${winClass}`} aria-hidden="true"></div>
        )}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
    //setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove)
    //setXIsNext(nextMove % 2 === 0)
  }
  const moves = history.map((squares, move)=>{
    let description
    if (move > 0) {
      description = "Go to move #" + move
    } else {
      description = "Go to game start"
    }
    return (
      <li key={move}>
        <button onClick={()=>jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
