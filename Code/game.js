class Game {
  constructor(board, p1, p2, playFirst, hasBot, app) {
    this.board = board;
    this.players = [p1, p2];
    this.turn = playFirst ? 0 : 1;
    this.running = true;
    this.hasBot = hasBot;
    this.app = app;

    setMessage("Turn of " + this.getPlayerName(this.turn));
    updateBoardInfo(this.players);
    this.ask_to_play();
  }

  ask_to_play() {
    updateBoardInfo(this.players);
    setMessage("Turn of " + this.getPlayerName(this.turn));
    const valid_moves = this.board.validMoves(this.turn);
    this.players[this.turn].chooseMove(this, valid_moves);
  }

  play(player, choice) {
    console.log("game play", player, choice);
    console.log(this.running, this.turn);
    if (!this.running || this.turn != player) {
      return;
    }

    this.turn = this.board.sow(this.turn, choice);

    if (this.checkEndGame()) {
      this.running = false;
      this.app.endGame();
      return;
    }
    this.ask_to_play();
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
      else {
        setMessage(winner + " WON");
      }

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
