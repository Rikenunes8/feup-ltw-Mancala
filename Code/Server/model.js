const crypto = require('crypto');

let games = {}

function joinGame(nick, size, initial, group, count) {
  const d = Math.floor(Date.now() / 100000);
  const value = group + '_' + size + '_' + d + '_' + initial + '_' + count;
  const hash = crypto.createHash('md5').update(value).digest('hex');

  if (!(hash in games)) {
    games[hash] = {
      "players": [nick]
    }
  }
  else if (games[hash].players.length == 1) {
    if (! (games[hash].players.includes(nick))) {
      games[hash].players.push(nick);
      createGame(hash, size, initial);
    }
  }
  else {
    hash = joinGame(nick, size, initial, group, count+1)
  }
  return hash;
}

function createGame(hash, size, initial) {
  const pits = new Array(size).fill(initial);
  const players = games[hash].players;
  games[hash]["game"] = {
    "board": {
      "sides": { 
        [players[0]]: { 
          "pits": pits, 
          "store":0 
        },
        [players[1]]: { 
          "pits": pits, 
          "store":0 
        }
      }, 
      "turn": players[0]
    }, 
    "stores": { 
      [players[0]]: 0,
      [players[1]]: 0
    }
  }
}

function removeGame(hash) {
  if (! (hash in games)) {
    return false;
  }
  else {
    delete games[hash];
    return true;
  }
}

pits1 = [4,4,4,4,4,4]
pits2 = [4,4,4,4,4,4]
store1 = 0;
store2 = 0;

let board = []
for (const pit of this.pits1) 
  board.push(pit);
board.push(this.store1);
for (const pit of this.pits2.reverse()) 
  board.push(pit);
board.push(this.store2);



function sow(board, player, pit) {
  const size = board.length;
  const side = (size/2)-1;
  const storeOf = [ (size/2)-1, size-1 ];
  const opponent = (player+1)%2;

  let i = (player*(size/2) + pit) % size;
  let seeds = board[i]; board[i] = 0;
  if (seeds == 0) return player;

  i = (i+1) % size;
  while (seeds != 0) {
    if (i == storeOf[opponent]) i = (i+1) % size;
    board[i] += 1;
    i = (i+1) % size;
  }

  i = (i-1 + size) % size;
  if (i == storeOf[player]) {
    return player;
  }
  else if (Math.floor(i/(size/2)) == player && board[i] == 1) {
    board[storeOf[player]] += board[i]; 
    board[i] = 0;
    board[storeOf[player]] += board[2*side - i]; 
    board[2*side - i] = 0;
  }
  return (player+1) % 2;
}


module.exports = {joinGame, removeGame, sow};