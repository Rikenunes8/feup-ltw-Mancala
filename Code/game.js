class Game {
  constructor(board, p1, p2, playFirst) {
    this.board = board;
    this.players = [p1, p2];
    this.turn = playFirst ? 0 : 1;
    this.running = true;
    
    this.board.setMessage("Play now "+this.players[this.turn].name);
    if (!playFirst)
      setTimeout(()=> {while (this.play(1));}, 2000);
  }

  playRound(player) {
    while (this.play(player++));
    setTimeout(()=> {while (this.play(player%2));}, 2000);
    
  }

  play(player) {
    let oldTurn = this.turn;
    if (!this.running || this.turn != player) 
      return false;

    let choice = this.players[this.turn].play();
    
    if (choice == -1) 
      return false;
    if (this.board.isEmpty(player, choice))
      return this.play(player);

    this.turn = this.board.sow(this.turn, choice);

    if (this.checkEndGame()) {
      this.endGame();
    }
    else {
      if (this.turn == oldTurn)
        this.board.setMessage("Play again "+this.players[this.turn].name);
      else
        this.board.setMessage("Play now "+this.players[this.turn].name);
    }

    return this.turn == oldTurn;
  }

  checkEndGame() {
    let endGame = false;
    this.players[0].score = this.board.store1.nSeeds;
    this.players[1].score = this.board.store2.nSeeds;

    let totalSeeds = 2*this.board.nPits * this.board.nSeeds;
    if (this.players[0].score > totalSeeds/2 || this.players[1].score > totalSeeds/2) {
      endGame = true;
    }
    else if(!this.anyMove(this.turn)) {
      this.board.collectAllSeeds((this.turn+1)%2);
      endGame = true;
    }
    return endGame;
  }

  anyMove(player) {
    let nPits = parseInt(this.board.nPits);
    for (let i = 0; i < nPits; i++) {
      if (this.board.holes[player*(nPits + 1) + i].nSeeds != 0)
        return true;
    }
    return false;
  }
  endGame() {
    this.running = false;
    this.board.setMessage("End of the game");
    
    setTimeout(()=>{}, 2000);
    
    let p1 = this.players[0];
    let p2 = this.players[1];
    if (p1.score > p2.score)
      this.board.setMessage(p1.name + " WON");
    else if (p1.score < p2.score)
      this.board.setMessage(p2.name + " WON");
    else
      this.board.setMessage("TIE");
  }

}

function initGame(object) {
  let nSeeds = document.querySelector("#n_s input").value;
  let nPits = document.querySelector("#n_p input").value;
  let playFirst = document.querySelector("#play_first input").checked;
  let modes = document.querySelectorAll("#game_mode input");
  let gameMode;
  for (let i = 0; i < modes.length; i++) {
    if (modes[i].checked) {
      gameMode = i;
      break;
    }
  }
  let levels = document.querySelectorAll("#ai_level input");
  let aiLevel;
  for (let i = 0; i < levels.length; i++) {
    if (levels[i].checked) {
      aiLevel = i+1;
      break;
    }
  }

  if (gameMode == 0) {
    let board = new Board(nSeeds, nPits);
    let p1 = new PlayerHuman();
    let p2 = new PlayerAI(board, aiLevel);
    let game = new Game(board, p1, p2, playFirst);
    makePlayable(p1, game);
  
    object['ref'] = game;
  }
  else {

  }
}

function endGame(object) {
  let game = object['ref'];
  game.endGame();
}

function makePlayable(player, game) {
  const pits = document.querySelectorAll("#zone-p1 .pit-info .pit");
  for(let i = 0; i < pits.length; i++)
    pits[i].addEventListener("click", function() {player.setNextPlay(i); game.playRound(0);});
}




window.addEventListener("load", function() {
  let nPits = document.querySelector("#n_p input").value;
  new Board(0, nPits);
  ranking();
});