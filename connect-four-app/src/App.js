import React,{ Component } from 'react';
import './App.css';


//Holes are the places that the player pieces go in
function Hole(props){
  return <div className="Hole"><div className={props.value}></div></div>
}
//Columns are vertical and made up of holes
//A player clicks on a column in order to play a piece
function Column(props){
    return <div className="Column" onClick={() => props.handleClick()}>
      {[...Array(props.holes.length)].map((x, j) => 
        <Hole key={j} value={props.holes[j]}></Hole>)}
      </div>
 }

class Board extends Component {
  //The constructor
  constructor() {
    super();
    //This is used when the app is first opened
    this.state = {
      boardState: new Array(7).fill(new Array(6).fill(null)),
      //The red player goes first in the first game after opening the app
      playerTurn: 'Red',
      gameSelected: false,
      //There is no winner yet, so no winner is set yet
      winner: '',
      //boardFull is set to zero because all the holes are empty
      boardFull:0
    }
  }
  //For when the player clicks the "Play" button to start the game
  selectStartGame(mode){
    this.setState({ 
       boardState: new Array(7).fill(new Array(6).fill(null)),
       gameSelected: true,
       //boardFull is set to zero because all the holes are empty when a game start
       boardFull:0
    })
  }
  //A move is made when the column is clicked
  makeMove(columnID){
    //For updating reasons, this creates a copy of the board
    const boardCopy = this.state.boardState.map(function(arr) {
      return arr.slice();
    });
    //Check to make sure the column is not full
    if( boardCopy[columnID].indexOf(null) !== -1 ){
      //Put player-piece on board in specified column
      let newColumn = boardCopy[columnID].reverse()
      newColumn[newColumn.indexOf(null)] = this.state.playerTurn
      newColumn.reverse()
      //The board is updated after the move is made, then it is the next player's turn
      //And the boardFull counter is incremented by 1
      this.setState({
        playerTurn: (this.state.playerTurn === 'Red') ? 'Yellow' : 'Red',
        boardState: boardCopy,
        boardFull: this.state.boardFull+1
      })
      console.log(this.state.boardFull);
    }
  }

  //Game will make a move when the player clicks, as long as the game hasn't been won yet.
  handleClick(columnID) {
    if(this.state.winner === ''){
      this.makeMove(columnID)
    }
  }
  
  //Check for a winner every time a player makes a move (every time the game board updates)
  componentDidUpdate(){
    let winner = checkWinner(this.state.boardState)
    if(this.state.winner !== winner)
      this.setState({winner: winner})
    }
  
  
  render(){

    //Display the win message when the game is won
    let winnerMessageStyle
    if(this.state.winner !== ""){
      winnerMessageStyle = "winnerMessage appear"
    }else {
      winnerMessageStyle = "winnerMessage"
    }
  

    //Construct the columns (each column has an id and is made of holes)
    let columns = [...Array(this.state.boardState.length)].map((x, i) => 
      <Column
          key={i}
          holes={this.state.boardState[i]}
          handleClick={() => this.handleClick(i)}
      ></Column>
    )
    /*This section of code displays the game board, displays the win message if the game has been won,
    and displays the "play" button when: the game hasn't been selected yet, the game has been won,
    or the game board is full (meaning there was a tie). The board is full when 42 player-pieces
    have been played, but there is no winner (7 columns x 6 rows = 42 holes) */
    return (
      <div>
        {this.state.gameSelected &&
          <div className="Board">
            {columns}
          </div>
        }
        <div className={winnerMessageStyle}>{this.state.winner}</div>
        {(!this.state.gameSelected || this.state.winner !== '' || this.state.boardFull === 42) &&
          <div>
            <button onClick={() => this.selectStartGame()}>Play</button>
          </div>
        }
      </div>
    )
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Connect-4</h2>
        </div>
        <div className="Game">
          <Board></Board>
        </div>
      </div>
    );
  }
}
//This function checks the line to see if it is empty or not 
//and to see if the line is made up of all the same colour
function checkLine(a,b,c,d) {
    return ((a !== null) && (a === b) && (a === c) && (a === d));
}
//This function checks for a winner
//If there is a winner, this function returns a win message
/*In this function, r stands for rows, c stands for columns, and each bs[c][r] is a hole*/
function checkWinner(bs) {
    
    //Check the horizontal lines
    for (let r = 0; r < 6; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r], bs[c+2][r], bs[c+3][r]))
                 return bs[c][r] + ' wins!'

    //Check the vertical lines
    for (let c = 0; c < 7; c++)
        for (let r = 0; r < 4; r++)
            if (checkLine(bs[c][r], bs[c][r+1], bs[c][r+2], bs[c][r+3]))
                return bs[c][r] + ' wins!'

      //Check the diagonal lines that go up towards the right
      for (let r = 0; r < 4; r++)
      for (let c = 3; c < 6; c++)
          if (checkLine(bs[c][r], bs[c-1][r+1], bs[c-2][r+2], bs[c-3][r+3]))
              return bs[c][r] + ' wins!'

    //Check the diagonal lines that go up towards the left
    for (let r = 0; r < 3; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r+1], bs[c+2][r+2], bs[c+3][r+3]))
                 return bs[c][r] + ' wins!'

    //When there is no winner there is no winner message displayed
    return "";
}
export default App;

