import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  let squareStyle = props.winning ? 'square winning' : 'square';
  return (
    <button className={squareStyle} onClick={() => props.onClick()} >
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        winning={this.props.winning.includes(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createBoard() {
    // always 3 x 3
    const nrow = 3;
    const ncol = 3;
    let board = new Array(nrow);
    let cellCounter = 0;

    for (let i=0; i < nrow; i++) {
      const columns = new Array(ncol);
      for (let j=0; j < ncol; j++) {
        columns[j] = (this.renderSquare(cellCounter));
        cellCounter ++;
      }
      board[i] = (<div className="board=row">{columns}</div>);
    }
    return (
      <div>{board}</div>
    );
  }



  render() {
    return this.createBoard();

//    return (
//      <div>
//        <div className="board-row">
//          {this.renderSquare(0)}
//          {this.renderSquare(1)}
//          {this.renderSquare(2)}
//        </div>
//        <div className="board-row">
//          {this.renderSquare(3)}
//          {this.renderSquare(4)}
//          {this.renderSquare(5)}
//        </div>
//        <div className="board-row">
//          {this.renderSquare(6)}
//          {this.renderSquare(7)}
//          {this.renderSquare(8)}
//        </div>
//      </div>
//    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        currentLocation: null
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0,
      this.state.stepNumber + 1);

    const current = history[history.length - 1];
    const squares = current.squares.slice();
    //might need to update
    if (calculateWinner(squares) || squares[i]) {
      console.log('hi');
      return;
    }

    const getLocation = (move) => {
      const moveLocation = {
        0: [1,1],
        1: [2,1],
        2: [3,1],
        3: [1,2],
        4: [2,2],
        5: [3,2],
        6: [1,3],
        7: [2,3],
        8: [3,3],
      };
      return moveLocation[move]
    };

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        currentLocation: getLocation(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      let desc = 'Go to game start';
      let moveText = (move, col, row) => `Go to move # ${move} at (col ${col}, row ${row})`

      if (move) {
        let col = step.currentLocation[0];
        let row = step.currentLocation[1];
        desc = moveText(move, col, row);
      }
      const clickedButton = move === this.state.stepNumber ? 'button-green' : '';

      return (
        <li key={move}>
          <button className={clickedButton} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    })
    let status;
    if (winner) {
      let winText = (winner, winningSquares) => `Winner: ${winner} @ cells ${winningSquares}`;
      status = winText(winner['winner'], winner['winningSquares'])
      //status = 'Winner: ' + winner['winner'] + winner['winningSquares'];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winning={winner ? winner['winningSquares'] : []}
            onClick={(i) => this.handleClick(i)}
        />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
  for (let i=0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        'winner': squares[a],
        'winningSquares': [a,b,c]
      };
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

