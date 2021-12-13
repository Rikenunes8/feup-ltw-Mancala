class Player {
  constructor(nPits, vPits) {
    this.store = [];
    this.pits = [];
    for (let _ = 0; _ < nPits; _++){
      this.pits.push(createSeeds(vPits));
    }
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

function createSeeds(n) {
  let seeds = [];
  for (let j = 0; j < n; j++) {
    let seed = document.createElement('div');
    seed.setAttribute('class', 'seeds');
    let pos1 = Math.floor(Math.random()*60);
    let pos2 = Math.floor(Math.random()*90);
    seed.style.transform = "translate("+pos1+"px, "+pos2+"px)";
    seeds.push(seed);
  }
  return seeds;
}

function drawSeeds(hole, lseeds) {
    for (let seed of lseeds)
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
    if (player == 1) {
      pitHole.addEventListener("click", function() {game.playAuto(i); drawBoard(game);});
      index = i;
    }
    else {
      index = game.num_pits - i - 1;
    }
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
  const game = new Game();
  drawBoard(game);
}

window.addEventListener("load", function() {
  initGame();
});