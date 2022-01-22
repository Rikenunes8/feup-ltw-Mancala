class Ranking {
  constructor(ranks) {
    if (ranks) {
      this.ranks = JSON.parse(ranks);
    }
    else {
      this.ranks = {
        "ranking": [
          {"nick": "Easy", "victories": 0, "games": 0},
          {"nick": "Medium", "victories": 0, "games": 0},
          {"nick": "Hard", "victories": 0, "games": 0}
        ]
      }
    }
  }
}

class RankingLocal extends Ranking {
  constructor() {
    super(localStorage.getItem('ranks'));
  }
  update(aiLevel, win) { 
    this.ranks.ranking[aiLevel-1].games += 1;
    this.ranks["ranking"][aiLevel-1].victories += win? 1:0;
    localStorage.setItem('ranks', JSON.stringify(this.ranks));
  }
}