class Game {
  constructor(board, p1, p2, playFirst) {
    this.board = board;
    this.players = [p1, p2];
    this.turn = playFirst ? 0 : 1;
  }

  play(player) {
    if (this.turn == -1) return;
    console.log("Play");
    console.log(player);
    console.log(this.turn);

    if (player != this.turn) return;

    let choice = this.players[this.turn].play();
    console.log("choice: "+choice)
    if (choice == -1) return;
    this.turn = this.board.sow(this.turn, choice);
    console.log("newturn: "+this.turn);

    if (this.checkEndGame()) return;
    this.play(this.turn);

  }

  checkEndGame() {
    this.players[0].score = this.board.store1.nSeeds;
    this.players[1].score = this.board.store2.nSeeds;

    let totalSeeds = 2*this.board.nPits * this.board.nSeeds;
    if (this.players[0].score > totalSeeds/2 || this.players[1].score > totalSeeds/2) {
      this.turn = -1;
      return true;
    }
    else if(!this.anyMove(this.turn)) {
      this.turn = -1
      console.log("End game for not to have more moves")
      // TODO: when Game.play() is ok
      return true;
    }
    return false;
  }

  anyMove(player) {
    let nPits = parseInt(this.board.nPits);
    for (let i = 0; i < nPits; i++) {
      if (this.board.holes[player*(nPits + 1) + i].nSeeds != 0)
        return true;
    }
    return false;
  }
}

function initGame() {
  let nSeeds = document.querySelector("#n_s input").value;
  let nPits = document.querySelector("#n_p input").value;
  let playFirst = true; // TODO:

  let board = new Board(nSeeds, nPits);
  let p1 = new PlayerHuman();
  let p2 = new PlayerAI(board, 1);
  let game = new Game(board, p1, p2, playFirst);
  makePlayable(p1, game);
}


function makePlayable(player, game) {
  const pits = document.querySelectorAll("#zone-p1 .pit-info .pit");
  for(let i = 0; i < pits.length; i++)
    pits[i].addEventListener("click", function() {player.setNextPlay(i); game.play(0);});
}

window.addEventListener("load", function() {
  let nSeeds = document.querySelector("#n_s input").value;
  let nPits = document.querySelector("#n_p input").value;
  new Board(nSeeds, nPits);
});