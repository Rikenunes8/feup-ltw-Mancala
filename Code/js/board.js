class Board {
  constructor(nSeeds, nPits) {
    this.nSeeds = parseInt(nSeeds);
    this.nPits = parseInt(nPits);
    this.store1;
    this.store2;
    this.pits1 = [];
    this.pits2 = [];
    this.holes = [];
  }

  initHoles() {
    for (const pit of this.pits1) 
      this.holes.push(pit);
    this.holes.push(this.store1);
    for (const pit of this.pits2.reverse()) 
      this.holes.push(pit);
    this.holes.push(this.store2);

    this.pits2.reverse();
  }

  sow(turn, choice) {
    const size = this.holes.length;
    const ownStore = (turn == 0 ? size/2 : size) - 1;
    const pass = (turn == 0 ? size : size/2) - 1;

    let i = (turn*(size/2) + choice) % size;
    let seeds = this.takeAllSeeds(this.holes[i]);
    if (seeds.length == 0) return turn;
    i = (i+1) % size;
    while (seeds.length != 0) {
      let seed = seeds.pop();
      if (i == pass) i = (i+1) % size;
      this.addSeed(this.holes[i], seed);
      i = (i+1) % size;
    }

    i = (i-1 + size) % size;
    if (i == ownStore) {
      return turn;
    }
    else if (Math.floor(i/(size/2)) == turn && this.holes[i].nSeeds == 1) {
      let ownSeeds = this.takeAllSeeds(this.holes[i]);
      let oppSeeds = this.takeAllSeeds(this.holes[2*this.nPits - i]);
      while (ownSeeds.length != 0) {
        let seed = ownSeeds.pop();
        this.addSeed(this.holes[ownStore], seed);
      }
      while (oppSeeds.length != 0) {
        let seed = oppSeeds.pop();
        this.addSeed(this.holes[ownStore], seed);
      }
    }
    return (turn+1) % 2;
  }

  collectAllSeeds() {
    const side = this.nPits+1;
    for (let p = 0; p < 2; p++) {
      const storeIndex = (p+1)*side - 1;
      for (let i = 0; i < this.nPits; i++) {
        let seeds = this.takeAllSeeds(this.holes[p*side + i]);
        while (seeds.length != 0) {
          let seed = seeds.pop();
          this.addSeed(this.holes[storeIndex], seed);
        }
      }
    }
  }

  validMoves(player) {
    let valids = []
    for (let i = 0; i < this.nPits; i++) {
      const sideSize = parseInt(this.nPits)+1;
      if (this.holes[player*sideSize + i].nSeeds != 0) {
        valids.push(i);
      }
    }
    return valids;
  }

  getStoreSeeds(player) {
    const storeIndex = (player+1)*(this.nPits+1) - 1;
    return this.holes[storeIndex].nSeeds;
  }
}

class BoardReal extends Board {
  constructor(nSeeds, nPits) {
    super(nSeeds, nPits);
    
    let board = document.querySelector("#board");
    board.innerHTML = "";
    this.store1 = this.createStore(1);
    this.store2 = this.createStore(2);
    this.pits1 = []
    this.pits2 = []
    const zone1 = this.createPits(1);
    const zone2 = this.createPits(2);

    this.initHoles();

    board.appendChild(this.store2.info);
    board.appendChild(zone2);
    board.appendChild(this.store1.info);
    board.appendChild(zone1);
  }

  createStore(player) {
    const store = document.createElement('div');
    store.setAttribute('class', 'store-info');
    store.setAttribute('id', 'store-p'+player);
    return new Hole(store, 0, true, player==2);
  }

  createPits(player) {
    let pits = player == 1 ? this.pits1 : this.pits2;
    const zone = document.createElement('div');
    zone.setAttribute('class', 'pits-container');
    zone.setAttribute('id', 'zone-p'+player);
    for(let i = 0; i < this.nPits; i++) {
      let pitInfo = document.createElement('div');
      pitInfo.setAttribute('class', 'pit-info');
      pits.push(new Hole(pitInfo, this.nSeeds, false, player==2));
      zone.appendChild(pitInfo);
    }
    return zone;
  }

  addSeed(holeInfo, seed) {
    holeInfo.nSeeds++;
    holeInfo.transformSeed(seed);
    holeInfo.score.innerHTML = holeInfo.nSeeds;
    holeInfo.seeds.push(seed);
    holeInfo.hole.appendChild(seed);
    return holeInfo.nSeeds;
  }

  takeAllSeeds(holeInfo) {
    holeInfo.nSeeds = 0;
    holeInfo.score.innerHTML = 0;
    const seeds = holeInfo.seeds;
    holeInfo.seeds = [];
    return seeds;
  }

  isEmpty(turn, choice) {
    const sideSize = parseInt(this.nPits)+1;
    return this.holes[turn*sideSize + choice].isEmpty();
  }

}

class BoardFake extends Board {
  constructor(board) {
    super(board.nSeeds, board.nPits);
    this.store1 = {'nSeeds': board.store1.nSeeds};
    this.store2 = {'nSeeds': board.store2.nSeeds};
    for (const pit of board.pits1)
      this.pits1.push({'nSeeds': pit.nSeeds});
    for (const pit of board.pits2)
      this.pits2.push({'nSeeds': pit.nSeeds});

    this.initHoles();
  }

  addSeed(holeInfo, seed) {
    holeInfo.nSeeds++;
    return holeInfo.nSeeds;
  }

  takeAllSeeds(holeInfo) {
    let seeds = [];
    for (let i = 0; i < holeInfo.nSeeds; i++)
      seeds.push(null);
    holeInfo.nSeeds = 0;
    return seeds;
  }

  isEmpty(turn, choice) {
    const sideSize = parseInt(this.nPits)+1;
    return this.holes[turn*sideSize + choice].nSeeds == 0;
  }

}

class Hole {
  constructor(infoElem, nSeeds, isStore, isHoleFirst) {
    this.nSeeds = nSeeds;
    this.info = infoElem;
    this.hole = document.createElement('div');
    this.score = document.createElement('div');
    this.score.setAttribute('class', 'score');
    if (isStore) {
      this.dxMax = 60; this.dyMax = 500; this.rotMax = 90;
      this.hole.setAttribute('class', 'store hole');
    }
    else{
      this.dxMax = 40; this.dyMax = 200; this.rotMax = 90;
      this.hole.setAttribute('class', 'pit hole');
    } 
    this.seeds = this.createSeeds();

    this.score.innerHTML = this.nSeeds;
    for (const seed of this.seeds) {
      this.hole.appendChild(seed)
    }
    
    if (isHoleFirst) {
      this.info.appendChild(this.hole);
      this.info.appendChild(this.score);
    }
    else {
      this.info.appendChild(this.score);
      this.info.appendChild(this.hole);
    }
  }

  createSeeds() {
    let seeds = [];
    for (let _ = 0; _ < this.nSeeds; _++) {
      let seed = document.createElement('div');
      seed.setAttribute('class', 'seeds');
      this.transformSeed(seed);
      seeds.push(seed);
    }
    return seeds;
  }

  transformSeed(seed) {
    const dx = 0.2 + Math.floor(Math.random()*this.dxMax)/10;
    const dy = 0.5 + Math.floor(Math.random()*this.dyMax)/10;
    const rot = Math.floor(Math.random()*this.rotMax);
    seed.style.transform = "translate("+dx+"vw, "+dy+"vh) rotate("+rot+"deg)";
  }

  isEmpty() {
    return this.nSeeds == 0;
  }
}