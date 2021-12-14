/*class Player {
  constructor(nPits, nSeeds) {
    this.store = [];
    this.pits = [];
    for (let _ = 0; _ < nPits; _++) {
      this.pits.push(createSeeds(nSeeds, 50, 90, 90));
    }
  }
}

class Game {
  constructor(nPits, nSeeds, p1, p2) {
    this.nPits = nPits;
    this.nSeeds = nSeeds;
    this.totalSeeds = nSeeds*nPits;
    this.players = [p1, p2];
  }

  sow(side, pit) {
    const turn = side;
    let seedsToSow = this.players[side].pits[pit];
    this.players[side].pits[pit] = [];
    pit++;

    if (seedsToSow.length == 0)
      return turn;
    while (seedsToSow.length > 0) {
      if (pit == this.num_pits) {
        if (side == turn) {
          let seed = seedsToSow.pop();
          this.players[side].store.push(seed);
        }
        pit = 0;
        if (seedsToSow.length != 0)
          side = (side+1)%2;
      }
      else {
        let seed = seedsToSow.pop();
        this.players[side].pits[pit].push(seed);
        pit++;
      }
    }
    pit--;
    if (turn == side) {
      if (pit == -1) {
        return turn;
      }
      if (this.players[side].pits[pit].length == 1) {
        this.collectOpposite(side, pit);
      }
    }
    return (turn+1)%2;
  }

  collectOpposite(side, pit) {
    let seed = this.players[side].pits[pit].pop();
    this.players[side].store.push(seed);
    while(this.players[(side+1)%2].pits[this.num_pits-pit-1].length > 0){
      let seed = this.players[(side+1)%2].pits[this.num_pits-pit-1].pop();
      this.players[side].store.push(seed);
    }
  }

  playAuto(pit) {
    if (this.sow(0, pit) != 0) {
      let tryAgain = true;
      while (tryAgain) {
        tryAgain = this.sow(1, Math.floor(Math.random() * this.num_pits))
      };
      
      //setTimeout(() => {
      //},2000);

    }
  }
}


function createSeeds(n, dxMax, dyMax, rotMax) {
  let seeds = [];
  for (let j = 0; j < n; j++) {
    let seed = document.createElement('div');
    seed.setAttribute('class', 'seeds');
    let dx = Math.floor(Math.random()*dxMax);
    let dy = Math.floor(Math.random()*dyMax);
    let rot = Math.floor(Math.random()*rotMax);
    seed.style.transform = "translate("+(0.5+dx/10)+"vw, "+(0.5+dy/10)+"vw) rotate("+rot+"deg)";
    seeds.push(seed);
  }
  return seeds;
}



function drawSeeds(hole, seeds) {
  for (let seed of seeds)
    hole.appendChild(seed);
}
function drawStore(game, player) {
  const store = document.createElement('div');
  store.setAttribute('class', 'store-info');
  store.setAttribute('id', 'store-p'+player);

  let storeHole = document.createElement('div');
  let storeScore = document.createElement('div');
  storeHole.setAttribute('class', 'store hole');
  storeScore.setAttribute('class', 'score');
  storeScore.innerHTML = game.players[player-1].store.length;
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
    
    if (player == 1)  index = i;
    else              index = game.num_pits - i - 1;

    pitScore.innerHTML = game.players[player-1].pits[index].length;
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

function initGame() {
  let nSeeds = document.querySelector("#n_s input").value;
  let nPits = document.querySelector("#n_p input").value;
  let p1 = new Player(nPits, nSeeds);
  let p2 = new Player(nPits, nSeeds);
  const game = new Game(nPits, nSeeds, p1, p2);
  drawBoard(game);
  return game;
}

function endGame() {

}




*/