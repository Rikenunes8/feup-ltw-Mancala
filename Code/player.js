class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
  }
}

class PlayerHuman extends Player {
  constructor(name="Unknown") {
    super(name);
    this.nextPlay = -1;
  }
  setNextPlay(n) {
    this.nextPlay = n;
  }
  play() {
    let choice = this.nextPlay;
    this.nextPlay = -1;
    return choice;
  }
}

class PlayerAI extends Player {
  constructor(board, level, name="Bot") {
    super(name);
    this.board = board
    this.level = level;
  }
  play() {
    if (this.level == 1) {
      return Math.floor(Math.random() * this.board.nPits);
    }
    else if (this.level == 2) {
      return this.currentBestMove();
    }
    else {
      return 0; // TODO: minimax
    }
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

  bestMove()
  {
    let turn = 1;
    let isMin = false;
    let lresB = [];
    for(let i = 0; i < this.board.nPits; i++)
    {
      let board1 = new BoardFake(this.board);
      let nextTurn = board1.sow(1, i);
      let children1 = this.childrenGen(board1, !isMin)
      children1 = this.treat(children1, nextTurn, turn);
      lresB.push();
    }
  }

  childrenGen(b, isMin)
  {
    let children = [];
    for(let i = 0; i < b.nPits; i++)
    {
      let child = new BoardFake(b)
      if(isMin)
        let turn = child.sow(1, i);
      else
        let turn = child.sow(0, i);
      
      children.push([i, child, turn, this.euristic(child)]);
    }
    return children;
  }

  /**
   * 
   * @param {*} b - board that is to be evaluated.
   * @returns - evaluation. Positive favours player, negative favours bot.
   */
  //TODO: game ending conditions to be included.
  euristic(b)
  {
    let eval = 0;
    
    for(let i = 0; i < this.b.pits1.length; i++)
    {
      eval += this.b.pits1[i].length;
    }

    for(let i = 0; i < this.b.pits2.length; i++)
    {
      eval -= this.b.pits2[i].length;
    }

    eval += (b.store1.nSeeds * 2);
    eval -= (b.store2.nSeeds * 2);

    return eval;
  }
}