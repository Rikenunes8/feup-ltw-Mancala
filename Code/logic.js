class Player {
  constructor(nPits, vPits) {
    this.store = 0;
    this.pits = []
    for (let _ = 0; _ < nPits; _++)
      this.pits.push(vPits);
  }
}

class Game {
  constructor() {
    this.num_seeds = document.querySelector("#n_s input").value;
    this.num_pits = document.querySelector("#n_p input").value;
    const p1 = new Player(this.num_pits, this.num_seeds);
    const p2 = new Player(this.num_pits, this.num_seeds);
    this.players = [p1, p2];
  }

  sow(side, pit) {
    const turn = side;
    let seeds = this.players[side].pits[pit];
    this.players[side].pits[pit] = 0;
    pit++;

    if (seeds == 0)
      return turn;
    while (seeds > 0) {
      if (pit == this.num_pits) {
        if (side == turn) {
          this.players[side].store++;
          seeds--;
        }
        pit = 0;
        if (seeds != 0)
          side = (side+1)%2;
      }
      else {
        this.players[side].pits[pit]++;
        seeds--;
        pit++;
      }
    }
    pit--;
    if (turn == side) {
      if (pit == -1) {
        return turn;
      }
      if (this.players[side].pits[pit] == 1) {
        this.collectMirrors(side, pit);
      }
    }
    return (turn+1)%2;
  }

  collectMirrors(side, pit) {
    this.players[side].pits[pit] = 0;
    let aux = this.players[(side+1)%2].pits[this.num_pits-pit-1];
    this.players[(side+1)%2].pits[this.num_pits-pit-1] = 0;
    this.players[side].store += 1 + aux;
  }

  playAuto(pit) {
    if (this.sow(0, pit) != 0)
      while (this.sow(1, Math.floor(Math.random() * this.num_pits)) == 1);
  }



}


function updateBoard(game) {
  const zoneP1 = document.querySelector("#zone-p1");
  const zoneP2 = document.querySelector("#zone-p2");
  const storeP1 = document.querySelector("#store-p1");
  const storeP2 = document.querySelector("#store-p2");

  const nSeedsP1 = zoneP1.querySelectorAll(".pit-info .score");
  const nSeedsP2 = zoneP2.querySelectorAll(".pit-info .score");
  const scoreP1 = storeP1.querySelector(".score");
  const scoreP2 = storeP2.querySelector(".score");

  for (let pit = 0; pit < nSeedsP1.length; pit++) {
    nSeedsP1[pit].innerHTML = game.players[0].pits[pit];
  }
  for (let pit = 0; pit < nSeedsP2.length; pit++) {
    nSeedsP2[pit].innerHTML = game.players[1].pits[nSeedsP2.length-1-pit];
  }

  scoreP1.innerHTML = game.players[0].store;
  scoreP2.innerHTML = game.players[1].store;

}


window.addEventListener("load", function() {
  const game = new Game();
  const cavities_p1 = document.querySelectorAll("#zone-p1 .pit-info .pit");
  let len = cavities_p1.length
  for (let c = 0; c < len; c++) {
    cavities_p1[c].addEventListener("click", function() {game.playAuto(c); updateBoard(game);});
  }


  updateBoard(game);
  

});