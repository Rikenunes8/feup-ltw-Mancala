class Board {
  constructor(nSeeds, nPits) {
    this.nSeeds = nSeeds;
    this.nPits = nPits;

    this.board = document.querySelector("#board");
    board.innerHTML = "";
    this.store1 = this.createStore(1);
    this.store2 = this.createStore(2);
    this.zone1 = this.createPits(1);
    this.zone2 = this.createPits(2);
    this.pits1 = this.zone1.childNodes;
    this.pits2 = this.zone2.childNodes;

    board.appendChild(this.store2);
    board.appendChild(this.zone2);
    board.appendChild(this.store1);
    board.appendChild(this.zone1);
  }

  createStore(player) {
    const store = document.createElement('div');
    store.setAttribute('class', 'store-info');
    store.setAttribute('id', 'store-p'+player);
  
    let storeHole = document.createElement('div');
    let storeScore = document.createElement('div');
    storeHole.setAttribute('class', 'store hole');
    storeScore.setAttribute('class', 'score');
    storeScore.innerHTML = 0;
    
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

  createPits(player) {
    const zone = document.createElement('div');
    zone.setAttribute('class', 'pits-container');
    zone.setAttribute('id', 'zone-p'+player);
    for(let i = 0; i < this.nPits; i++) {
      let pitInfo = document.createElement('div');
      let pitHole = document.createElement('div');
      let pitScore = document.createElement('div');
      pitInfo.setAttribute('class', 'pit-info');
      pitHole.setAttribute('class', 'pit hole');
      pitScore.setAttribute('class', 'score');
      
      if (player == 1)  index = i;
      else              index = -i - 1;

      pitScore.innerHTML = this.nSeeds;
      // createSeeds(pitHole, this.nSeeds);

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

  createSeeds(hole, seeds) {
    for (let seed of seeds)
      hole.appendChild(seed);
  }
}

class Hole {
  constructor(infoElem, nSeeds, isStore, isHoleFirst) {
    this.nSeeds;
    let hole = document.createElement('div');
    let score = document.createElement('div');
    score.setAttribute('class', 'score');
    if (isStore) hole.setAttribute('class', 'store hole');
    else         hole.setAttribute('class', 'pit hole');
    
    score.innerHTML = this.nSeeds;
    

  }

  createSeeds() {
    let seeds = [];
    for (let _ = 0; _ < this.nSeeds; _++) {
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
}


function initGame() {
  let nSeeds = document.querySelector("#n_s input").value;
  let nPits = document.querySelector("#n_p input").value;
  let board = new Board();
  initBoard(nSeeds, nPits)
}

function initBoard() {

}