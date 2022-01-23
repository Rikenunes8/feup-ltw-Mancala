class Player {
  _name;
  _score;
  constructor(name) {
    this._name = name;
    this._score = 0;
  }
  setName(name) {this._name = name;}
  setScore(score) {this._score = score;}
  getName() {return this._name;}
  getScore() {return this._score;}
}

class PlayerHuman extends Player {
  constructor(name="Unknown") {
    super(name);
  }
  chooseMove(game, validMoves) {
    this.game = game;
    this.validMoves = validMoves;
    this.myTurn = true;
  }
  play(choice) {
    if (this.myTurn && this.validMoves.includes(choice)) {
      this.myTurn = false;
      this.game.play(this.game.turn, choice);
    }
  }
}

class PlayerAI extends Player {
  #level;
  constructor(board, level, name="Bot") {
    super(name);
    this.board = board
    this.#level = level;
  }
  getLevel() {return this.#level;}

  chooseMove(game, validMoves) {
    let choice = -1;
    setTimeout(()=> {
      while (!validMoves.includes(choice)) {
        if (this.#level == 1) {
          choice = Math.floor(Math.random() * this.board.nPits);
        }
        else if (this.#level == 2) {
          choice = this.currentBestMove();
        }
        else if (this.#level == 3) {
          choice = this.bestMove();
        }
      }
      game.play(game.turn, choice);
    }, 2000);
  }


  currentBestMove() {
    let turn = 1;
    let lres = [];
    for(let i = 0; i < this.board.nPits; i++) {
      let boardFake = new BoardFake(this.board);
      let nextTurn = boardFake.sow(1, i);
      lres.push({'score': boardFake.store2.nSeeds, 'nextTurn': nextTurn});
    }

    let max = -1; let nextTurn = 0; let choice;
    for (let i = 0; i < lres.length; i++) {
      let move = lres[i];
      if (move.score > max || (move.score == max && move.nextTurn == turn)) {
        max = move.score;
        nextTurn = move.nextTurn;
        choice = i;
      }
    }

    return choice;
  }

  minimax(depth) {
    
  }
}