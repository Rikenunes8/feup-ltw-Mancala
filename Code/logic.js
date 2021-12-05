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

  zoneP1.innerHTML = "";
  zoneP2.innerHTML = "";
  storeP1.innerHTML = "";
  storeP2.innerHTML = "";

  console.log(zoneP2);
  
  //draw routine for player 2 (reverse)

  let store = document.createElement('div');
  store.setAttribute('class', 'store hole');
  let storeScore = document.createElement('div');
  storeScore.setAttribute('class', 'score');

  for (let j = 0; j < game.players[1].store; j++)
  {
      let seed = document.createElement('div');
      seed.setAttribute('class', 'seeds');
      //semi-random drawing routine
      store.appendChild(seed);
  }

  storeP2.appendChild(store);
  storeP2.appendChild(storeScore);


  for(let i = 0; i < game.num_pits; i++)
  {   
      console.log("HERE!");
      let pitInfo = document.createElement('div');
      pitInfo.setAttribute('class', 'pit-info');

      let pit = document.createElement('div');
      pit.setAttribute('class', 'pit hole');

      let pitScore = document.createElement('div');
      pitScore.setAttribute('class', 'score');
      
      for (let j = 0; j < game.players[1].pits[game.num_pits - i - 1]; j++)
      {
          let seed = document.createElement('div');
          seed.setAttribute('class', 'seeds');
          //semi-random drawing routine
          pit.appendChild(seed);
      }

      pitInfo.appendChild(pitScore);
      pitInfo.appendChild(pit);
      console.log(pitInfo);
      zoneP2.appendChild(pitInfo);
  }

  console.log(zoneP2);
  
  //draw routine for player 1

  storeScore = document.createElement('div');
  storeScore.setAttribute('class', 'score');
  store = document.createElement('div');
  store.setAttribute('class', 'store hole');

  for (let j = 0; j < game.players[0].store; j++)
  {
      let seed = document.createElement('div');
      seed.setAttribute('class', 'seeds');
      //semi-random drawing routine
      store.appendChild(seed);
  }

  storeP1.appendChild(storeScore);
  storeP1.appendChild(store);
  
  for(let i = 0; i < game.num_pits; i++)
  {
      let pitInfo = document.createElement('div');
      pitInfo.setAttribute('class', 'pit-info');

      let pit = document.createElement('div');
      pit.setAttribute('class', 'pit hole');

      let pitScore = document.createElement('div');
      pitScore.setAttribute('class', 'score');
      
      for (let j = 0; j < game.players[0].pits[i]; j++)
      {
          let seed = document.createElement('div');
          seed.setAttribute('class', 'seeds');
          //semi-random drawing routine
          pit.appendChild(seed);
      }
      pitInfo.appendChild(pit);
      pitInfo.appendChild(pitScore);
      zoneP1.appendChild(pitInfo);
      
  }

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

  const cavities_p1 = document.querySelectorAll("#zone-p1 .pit-info .pit");
  let len = cavities_p1.length;
  for (let c = 0; c < len; c++) {
    cavities_p1[c].addEventListener("click", function() {game.playAuto(c); updateBoard(game);});
  }

}

window.addEventListener("load", function() {
  const game = new Game();
  updateBoard(game);
  
});