class Board {
  constructor(nSeeds, nPits) {
    this.nSeeds = nSeeds;
    this.nPits = nPits;

    this.board = document.querySelector("#board");
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
    else if (Math.floor(i/(size/2)) == turn && this.holes[i].nSeeds == 1 ) {
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
}

class Hole {
  constructor(infoElem, nSeeds, isStore, isHoleFirst) {
    this.nSeeds = nSeeds;
    this.info = infoElem;
    this.hole = document.createElement('div');
    this.score = document.createElement('div');
    this.score.setAttribute('class', 'score');
    if (isStore) this.hole.setAttribute('class', 'store hole');
    else         this.hole.setAttribute('class', 'pit hole');
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
    let dxMax = 50;
    let dyMax = 90;
    let rotMax = 90;
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

class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
  }
}

class PlayerHuman extends Player {
  constructor(name="Unknown") {
    super(name);
    this.nextPlay = -1;
  }
  setNextPlay(n) {
    this.nextPlay = n;
  }
  play() {
    let choice = this.nextPlay;
    this.nextPlay = -1;
    return choice;
  }
}

class PlayerAI extends Player {
  constructor(board, level, name="Bot") {
    super(name);
    this.board = board
    this.level = level;
  }
  play() {
    if (this.level == 1) {
      return Math.floor(Math.random() * this.board.nPits);
    }
    else if (this.level == 2) {
      return 0; // TODO: best play in the round
    }
    else {
      return 0; // TODO: minimax
    }
  }
}

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

    this.play(this.turn);

  }
 
  /*start() {
    let totalSeeds = 2*this.board.nPits * this.board.nSeeds;
    while (this.players[0].score < totalSeeds/2 && this.players[1].score < totalSeeds/2) {
      this.play();
    }
  }*/

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

function endGame() {
  makeNotPlayable();
}



function makePlayable(player, game) {
  const pits = document.querySelectorAll("#zone-p1 .pit-info .pit");
  for(let i = 0; i < pits.length; i++)
    pits[i].addEventListener("click", function() {player.nextPlay = i; game.play(0);});
}

function makeNotPlayable() {
  const pits = document.querySelectorAll("#zone-p1 .pit-info .pit");
  for(let i = 0; i < pits.length; i++)
    pits[i].onclick = "";
}

window.addEventListener("load", function() {
  initGame();
});