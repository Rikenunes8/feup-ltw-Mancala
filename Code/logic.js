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


function drawSeeds(hole, n) {
  for (let j = 0; j < n; j++) {
    let seed = document.createElement('div');
    seed.setAttribute('class', 'seeds');
    //semi-random drawing routine
    hole.appendChild(seed);
  }
}

function drawStore(game, player) {
  const store = document.createElement('div');
  store.setAttribute('class', 'store-info');
  store.setAttribute('id', 'store-p'+player);

  let storeHole = document.createElement('div');
  let storeScore = document.createElement('div');
  storeHole.setAttribute('class', 'store hole');
  storeScore.setAttribute('class', 'score');
  storeScore.innerHTML = game.players[player-1].store;
  drawSeeds(storeHole, game.players[player-1].store)
  
  if (player == 1) {
    store.appendChild(storeScore);
    store.appendChild(storeHole);
  }
  else {
    store.appendChild(storeHole);
    store.appendChild(storeScore);
  }

  return store;
}

function drawPits(game, player) {
  const zone = document.createElement('div');
  zone.setAttribute('class', 'pits-container');
  zone.setAttribute('id', 'zone-p'+player);
  for(let i = 0; i < game.num_pits; i++) {
    let pitInfo = document.createElement('div');
    let pitHole = document.createElement('div');
    let pitScore = document.createElement('div');
    pitInfo.setAttribute('class', 'pit-info');
    pitHole.setAttribute('class', 'pit hole');
    pitScore.setAttribute('class', 'score');
    if (player == 1) {
      pitHole.addEventListener("click", function() {game.playAuto(i); drawBoard(game);});
      index = i;
    }
    else {
      index = game.num_pits - i - 1;
    }
    pitScore.innerHTML = game.players[player-1].pits[index];
    drawSeeds(pitHole, game.players[player-1].pits[index])

    if (player == 1) {
      pitInfo.appendChild(pitScore);
      pitInfo.appendChild(pitHole);
    }
    else {
      pitInfo.appendChild(pitHole);
      pitInfo.appendChild(pitScore);
    }
    
    zone.appendChild(pitInfo);
  }
  return zone;
}

function drawBoard(game) {
  const board = document.querySelector("#board");
  board.innerHTML = "";
  
  for (let i = 2; i > 0; i--) {
    board.appendChild(drawStore(game, i));
    board.appendChild(drawPits(game, i));
  }
}

window.addEventListener("load", function() {
  const game = new Game();
  drawBoard(game);
});