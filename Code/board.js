class Board {
  constructor(nSeeds, nPits) {
    this.nSeeds = nSeeds;
    this.nPits = nPits;

    let board = document.querySelector("#board");
    board.innerHTML = "";
    this.store1 = this.createStore(1);
    this.store2 = this.createStore(2);
    this.pits1 = []
    this.pits2 = []
    let zone1 = this.createPits(1);
    let zone2 = this.createPits(2);

    this.holes = [];
    for (let pit of this.pits1) this.holes.push(pit);
    this.holes.push(this.store1);
    for (let pit of this.pits2.reverse()) this.holes.push(pit);
    this.holes.push(this.store2);

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
    holeInfo.transformSeed(seed);
    holeInfo.nSeeds++;
    holeInfo.score.innerHTML = holeInfo.nSeeds;
    holeInfo.seeds.push(seed);
    holeInfo.hole.appendChild(seed);
    return holeInfo.nSeeds;
  }

  takeAllSeeds(holeInfo) {
    holeInfo.nSeeds = 0;
    holeInfo.score.innerHTML = 0;
    let seeds = holeInfo.seeds;
    holeInfo.seeds = [];
    return seeds;
  }

  sow(turn, choice) {
    let size = this.holes.length;
    let ownStore = (turn == 0 ? size/2 : size) - 1;
    let pass = (turn == 0 ? size : size/2) - 1;

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

    i = (i-1) % size;
    if (i == ownStore) {
      return turn;
    }
    else if (Math.floor(i/(size/2)) == turn && this.holes[i].nSeeds == 1 && this.holes[2*this.nPits - i].nSeeds != 0) {
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

  collectAllSeeds(player) {
    let side = this.nPits+1;
    let storeIndex = (player+1)*side - 1;

    for (let i = 0; i < this.nPits; i++) {
      let seeds = this.takeAllSeeds(this.holes[player*side + i]);
      while (seeds.length != 0) {
        let seed = seeds.pop();
        this.addSeed(this.holes[storeIndex], seed);
      }
    }
  }

  isEmpty(turn, choice) {
    let sideSize = parseInt(this.nPits)+1;
    return this.holes[turn*sideSize + choice].isEmpty();
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
      this.dxMax = 40; this.dyMax = 250; this.rotMax = 90;
      this.hole.setAttribute('class', 'store hole');
    }
    else{
      this.dxMax = 40; this.dyMax = 100; this.rotMax = 90;
      this.hole.setAttribute('class', 'pit hole');
    } 
    this.seeds = this.createSeeds();

    this.score.innerHTML = this.nSeeds;
    for (let seed of this.seeds) 
      this.hole.appendChild(seed)
    
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
    let dx = 0.2 + Math.floor(Math.random()*this.dxMax)/10;
    let dy = 0.5 + Math.floor(Math.random()*this.dyMax)/10;
    let rot = Math.floor(Math.random()*this.rotMax);
    seed.style.transform = "translate("+dx+"vw, "+dy+"vw) rotate("+rot+"deg)";
  }

  isEmpty() {
    return this.nSeeds == 0;
  }
}