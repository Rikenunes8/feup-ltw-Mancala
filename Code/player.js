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
      
      let lres = [];
      for(let i = 0; i < this.board.nPits; i++)
      {
        let boardSim = this.board;
        boardSim.sow(1, i);
        lres.push(boardSim.store2);
      }
      return lres.indexOf(Math.max(lres));

    }
    else {
      return 0; // TODO: minimax
    }
  }
}

/**
 * Given a board, simulates a turn in a given choice.
 * @param {Board} b 
 * @param {*} turn 
 * @param {*} choice 
 */
function simulSow(b, turn, choice)
{
  let size = b.holes.length;
  let ownStr = (turn == 0 ? size/2 : size) - 1;
  let pass = (turn == 0 ? size : size/2) - 1;

  let i = (turn*(size/2) + choice) % size;
  let seeds = this.takeAllSeeds(b.holes[i]);

  return (b.store2.score);
}