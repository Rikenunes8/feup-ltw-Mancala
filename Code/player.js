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
    this.fakeBoard;
    this.#level = level;
  }
  getLevel() {return this.#level;}

  chooseMove(game, validMoves) {
    this.fakeBoard = new BoardFake(this.board);
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
          choice = this.maxmin(5, this.fakeBoard, game.turn, (game.turn+1)%2)[0];
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

  maxmin(depth, board, player, playerToMax) {
    if (depth == -1 || this.isGameOver(board, player)) {
      board.collectAllSeeds();
      let score = board.getStoreSeeds(playerToMax)-board.getStoreSeeds((playerToMax+1)%2);
      return [null, score];
    }

    const validMoves = board.validMoves(player);
    const maximise = playerToMax === player;
    const worstScore = maximise ? -Infinity : Infinity;
    let bestMove = [validMoves[0], worstScore];

    for (let move of validMoves) {
      let tryBoard = new BoardFake(board);
      const nextToPlay = tryBoard.sow(player, move);

      const [_, score] = this.maxmin(depth-1, tryBoard, nextToPlay, playerToMax);
      
      const setNewMax = maximise && score >= bestMove[1];
      const setNewMin = (!maximise) && score <= bestMove[1];
      if (setNewMax || setNewMin) {
        bestMove = [move, score];
      }
      
    }
    return bestMove;
  }

  isGameOver(board, player) {
    for (let i = 0; i < board.nPits; i++) {
      if (!board.isEmpty(player, i))
        return false;
    }
    return true;
  }

}