class Game {
  constructor(board, p1, p2, playFirst, hasBot) {
    this.board = board;
    this.players = [p1, p2];
    this.turn = playFirst ? 0 : 1;
    this.running = true;
    this.hasBot = hasBot;

    setMessage("Turn of " + this.players[this.turn].name);
    if (!playFirst && this.hasBot)
      setTimeout(()=> {while (this.play(1));}, 2000);
  }

  playRound(player) {
    this.play(player++);
    
    if (this.hasBot)
      setTimeout(()=> {while (this.play(player%2));}, 2000);
    
  }

  play(player) {
    let oldTurn = this.turn;
    if (!this.running || this.turn != player) 
      return false;

    let choice = this.players[this.turn].play();
    
    if (choice == -1 || this.board.isEmpty(player, choice)) 
      return true;

    this.turn = this.board.sow(this.turn, choice);

    if (this.checkEndGame()) {
      this.endGame();
    }
    else {
      setMessage("Turn of " + this.players[this.turn].name);
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
    else if(!this.anyMove(this.turn) || !this.anyMove((this.turn+1)%2)) {
      this.board.collectAllSeeds();
      endGame = true;
    }
    return endGame;
  }

  anyMove(player) {
    for (let i = 0; i < this.board.nPits; i++) {
      if (!this.board.isEmpty(player, i))
        return true;
    }
    return false;
  }

  endGame(forcedEnd=false, winner) {
    this.running = false;
    setMessage("End of the game");
    
    setTimeout(()=>{}, 2000);
    if (forcedEnd) {
      if (!winner) setMessage("TIE");
      else setMessage(winner + " WON");
    }
    else {
      let p1 = this.players[0];
      let p2 = this.players[1];
      if (p1.score > p2.score)
        setMessage(p1.name + " WON");
      else if (p1.score < p2.score)
        setMessage(p2.name + " WON");
      else
        setMessage("TIE");
      openCloseGame(false);
    }
  }
}
