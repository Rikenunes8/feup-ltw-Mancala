const model = require('./model.js');
const ranking = require('./ranking.js');

const {endResponse, endResponseWithError, setHeaders} = require('./utils.js');


let responses = {};

module.exports.remember = function(response, hash, nick) {
  setHeaders(response, 'sse');
  if (hash in responses) {
    responses[hash][nick] = response;
  }
  else {
    responses[hash] = {[nick]:response}
  }
}

module.exports.forget = function(hash, nick) {
  delete responses[hash][nick];
  if (Object.keys(responses[hash]).length === 0) {
    delete responses[hash];
  } 
}

module.exports.update = function(hash) {
  const resps = responses[hash];
  const gameState = model.getGame(hash);
  const game = gameState["game"];
  if (game === undefined) return;
  for(const response in resps) {
    resps[response].write('data: '+ JSON.stringify(game) +'\n\n');
  }
  if ("winner" in game) {
    ranking.update(gameState);
    model.removeGame(hash);
  }
}

module.exports.get = function () {
  return responses;
}