import { useState } from "react";

function Square({ value, onSquareClick, winner }) {
  return (
    <button
      className={`square ${winner ? "winner" : null}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + squares[winner[0]];
  } else {
    if (isDraw(squares)) {
      status = "Draw";
    } else {
      status = "Next Player: " + (xIsNext ? "x" : "O");
    }
  }

  const board = Array(3).fill(null);
  for (let boardRow = 0; boardRow < 3; boardRow++) {
    const boardRowSquares = Array(3).fill(null);
    board[boardRow] = <div className="board-row">{boardRowSquares}</div>;
    for (let boardColumn = 0; boardColumn < 3; boardColumn++) {
      const squareNumber = boardRow * 3 + boardColumn;
      const isWinnerSquare = winner && winner.includes(squareNumber);
      boardRowSquares[boardColumn] = (
        <Square
          value={squares[squareNumber]}
          onSquareClick={() => handleClick(squareNumber)}
          winner={isWinnerSquare}
        />
      );
    }
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortMovesAscending, setSortMovesAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSortChange() {
    setSortMovesAscending(!sortMovesAscending);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = "You are at move #" + currentMove;
    } else if (move > 0) {
      description = "Go to move #" + move + " location " + getLocation(move);
    } else {
      description = "Go to game start";
    }
    return move === currentMove ? (
      <li key={move}>
        <div>{description}</div>
      </li>
    ) : (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  function getLocation(move) {
    const currentSquares = history[move];
    const previousSquares = history[move - 1];
    for (let i = 0; i < currentSquares.length; i++) {
      if (currentSquares[i] != previousSquares[i])
        return [Math.floor(i / 3), i % 3];
    }
    return null;
  }

  const sortedMoves = sortMovesAscending ? moves : moves.toReversed();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={handleSortChange}>
          {sortMovesAscending ? "Ascending" : "Descending"}
        </button>
        <ol>{sortedMoves}</ol>
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
      return lines[i];
    }
  }
  return null;
}

function isDraw(squares) {
  return !squares.includes(null);
}
