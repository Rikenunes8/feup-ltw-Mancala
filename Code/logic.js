class Hand {
  constructor(nPits, vPits) {
    this.pits = []
    for (let _ = 0; _ < nPits; _++) {
      this.pits.push(vPits);
    }
    this.storage = 0;
  }
}

class Game {
  constructor() {
    this.pits1 = [4,4,4,4,4,4];
    this.pits2 = [4,4,4,4,4,4];
  }
}
