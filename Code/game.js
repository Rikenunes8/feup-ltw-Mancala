class Game {
  constructor(board, p1, p2, playFirst, hasBot) {
    this.board = board;
    this.players = [p1, p2];
    this.turn = playFirst ? 0 : 1;
    this.running = true;
    this.hasBot = hasBot;

    setMessage("Turn of " + this.getPlayerName(this.turn));
    if (!playFirst && this.hasBot)
      setTimeout(()=> {while (this.play(1));}, 100);
  }

  playRound(player) {
    this.play(player++);
    if (this.hasBot) {
      setTimeout(()=> {while (this.play(player%2));this.updatePlayersScores();}, 2000);
    }
    else {
      this.updatePlayersScores();
    }
  }

  play(player) {
    const oldTurn = this.turn;
    if (!this.running || this.turn != player) {
      return false;
    }
    

    const choice = this.players[this.turn].play();
    
    if (choice == -1 || this.board.isEmpty(player, choice)) {
      return true;
    }

    this.turn = this.board.sow(this.turn, choice);

    if (this.checkEndGame()) {
      this.running = false;
      return false;
    }
    else {
      setMessage("Turn of " + this.getPlayerName(this.turn));
      return this.turn == oldTurn;
    }
  }

  checkEndGame() {
    let endGame = false;
    if(!this.anyMove(this.turn)) {
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

  endGame(winner) {
    this.running = false;
    
    if (winner !== undefined) {
      if (!winner) {
        setMessage("TIE");
        return 0;
      }
      else setMessage(winner + " WON");
      if (winner == this.getPlayerName(0)) return 1;
      else return -1;
    }
    else {
      const scoreP1 = this.getPlayerScore(0);
      const scoreP2 = this.getPlayerScore(1);
      if (scoreP1 > scoreP2) {
        setMessage(this.getPlayerName(0) + " WON");
        return 1;
      }
      else if (scoreP1 < scoreP2) {
        setMessage(this.getPlayerName(1) + " WON");
        return -1;
      }
      else {
        setMessage("TIE");
        return 0;
      }
    }
    return 
  }

  updatePlayersScores() {
    this.players[0].setScore(this.board.store1.nSeeds);
    this.players[1].setScore(this.board.store2.nSeeds);
  }

  getPlayerName(player) {
    return this.players[player].getName();
  }
  getPlayerScore(player) {
    return this.players[player].getScore();
  }
}
