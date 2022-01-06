class Game {
  constructor(board, p1, p2, playFirst) {
    this.board = board;
    this.players = [p1, p2];
    this.turn = playFirst ? 0 : 1;
    this.running = true;
    
    setMessage("Play now "+this.players[this.turn].name);
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
        setMessage("Play again "+this.players[this.turn].name);
      else
        setMessage("Play now "+this.players[this.turn].name);
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
    setMessage("End of the game");
    
    setTimeout(()=>{}, 2000);
    
    let p1 = this.players[0];
    let p2 = this.players[1];
    if (p1.score > p2.score)
      setMessage(p1.name + " WON");
    else if (p1.score < p2.score)
      setMessage(p2.name + " WON");
    else
      setMessage("TIE");
  }
}
