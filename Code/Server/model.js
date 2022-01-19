const crypto = require('crypto');

let games = {}

function joinGame(nick, size, initial, group, count) {
  const d = Math.floor(Date.now() / 100000);
  const value = group + '_' + size + '_' + d + '_' + initial + '_' + count;
  let hash = crypto.createHash('md5').update(value).digest('hex');

  if (!(hash in games)) {
    games[hash] = {
      "players": [nick],
      "size": size,
      "initial": initial 
    }
  }
  else if (games[hash].players.length == 1) {
    if (! (games[hash].players.includes(nick))) {
      games[hash].players.push(nick);
      createGame(hash);
    }
  }
  else {
    hash = joinGame(nick, size, initial, group, count+1)
  }
  return hash;
}

function createGame(hash) {
  const size = games[hash].size;
  const initial = games[hash].initial;
  let pits = []
  for (let _  = 0; _ < size; _++) pits.push(initial);
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

function hasGame(hash) {
  return hash in games;     
}

function isTurn(hash, nick) {
  return games[hash].game.board.turn === nick;
}

function inSide(hash, move) {
  return move >= 0 && move < games[hash].size;
}

function play(hash, move) {
  let game = games[hash];
  console.log(game);
  const p1 = game.players[0];
  console.log(p1)
  const p2 = game.players[1];
  console.log(p2)
  const player = p1 === game.game.board.turn? 0 : 1;
  console.log(player)

  let sides = game.game.board.sides;
  console.log(sides);
  if (sides[game.game.board.turn][move] == 0) {
    return false;
  }
  console.log("bef merge")
  let board = mergeHoles(sides[p1].pits, sides[p2].pits, sides[p1].store, sides[p2].store)
  console.log("aft merge")
  console.log(board);
  const next = sow(board, player, move);
  console.log(next)
  console.log("after sow")
  console.log(board)
  const arr = unmergeHoles(board, game.size);
  console.log(arr)
  sides[p1].pits = arr[0];
  sides[p2].pits = arr[1];
  sides[p1].store = arr[2];
  sides[p2].store = arr[3];
  game.game.pit = move;
  game.game.board.turn = game.players[next];

  return true;
}

function mergeHoles(pits1, pits2, store1, store2) {
  let board = []
  for (const pit of pits1) 
    board.push(pit);
  board.push(store1);
  for (const pit of pits2.reverse()) 
    board.push(pit);
  board.push(store2);
  return board;
}

function unmergeHoles(holes, size1) {
  const size = parseInt(size1);
  const pits1 = holes.slice(0, size);
  console.log(pits1)
  console.log(holes)
  console.log("Size:", size, " End:", 2*size+1);
  console.log(holes.slice(6, 13))
  const pits2 = holes.slice(size+1, 2*size+1);
  console.log(pits2)
  console.log(holes)
  const store1 = holes[size];
  console.log(store1)
  console.log(holes)
  const store2 = holes[2*size+1];
  console.log(store2)
  console.log(holes)
  return [pits1, pits2, store1, store2];
}

function sow(board, player, pit) {
  const size = board.length;
  const side = (size/2)-1;
  const storeOf = [ (size/2)-1, size-1 ];
  const opponent = (player+1)%2;
  console.log(size, side, storeOf, opponent);

  let i = (player*(size/2) + pit) % size;
  let seeds = board[i]; board[i] = 0;
  if (seeds == 0) return player;
  
  i = (i+1) % size;
  while (seeds != 0) {
    console.log(board);
    if (i == storeOf[opponent]) i = (i+1) % size;
    board[i]++;
    i = (i+1) % size;
    seeds--;
  }
  console.log(board)
  i = (i-1 + size) % size;
  if (i == storeOf[player]) {
    console.log("repeat")
    return player;
  }
  else if (Math.floor(i/(size/2)) == player && board[i] == 1) {
    board[storeOf[player]] += board[i]; 
    board[i] = 0;
    board[storeOf[player]] += board[2*side - i]; 
    board[2*side - i] = 0;
    console.log("collected oposite")
  }
  console.log(board)
  return (player+1) % 2;
}

function get() {
  for (const game in games) {
    console.log(games[game].game.board)
    for (const name in games[game].game.board.sides) {
      console.log(games[game].game.board.sides[name].pits);
    }
  }
  return games;
}


module.exports = {joinGame, removeGame, hasGame, isTurn, inSide, play, get};