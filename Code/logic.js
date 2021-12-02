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
    while (seeds > 0) {
      if (pit == this.num_pits-1) {
        if (side == turn) {
          this.players[side].store++;
          seeds--;
        }
        pit = -1;
        side = (side+1)%2;
      }
      else {
        pit++;
        this.players[side].pits[pit]++;
        seeds--;
      }
    }
    if (side == turn) {
      if (pit == -1) {
        return side;
      }
      else if (this.players[side].pits[pit] == 1) {
        collectMirrors(side, pit);
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

  playAuto(p) {
    let currentPlayer = p;
    

  }



}


window.addEventListener("load", function() {
  const game = new Game();
  const cavities_p1 = document.querySelectorAll("#zone-p1 .pits .pit");
  let len = cavities_p1.length
  for (let c = 0; c < len; c++) {
    cavities_p1[c].addEventListener("click", function() {game.sow(0, c)});
  }
  

});