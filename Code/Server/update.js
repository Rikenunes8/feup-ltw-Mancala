const model = require('./model.js');
const ranking = require('./ranking.js');

const {endResponse, endResponseWithError, setHeaders} = require('./utils.js');


let responses = {};

module.exports.remember = function(response, hash, nick) {
  if (!model.hasGame(hash)) {
    endResponseWithError(response, 400, "Invalid game reference")
  }
  setHeaders(response, 'sse');
  response.writeHead(200);
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
    model.removeGame(hash)
  } 
}

module.exports.update = function(hash) {
  const resps = responses[hash];
  const gameState = model.getGame(hash);
  const game = gameState["game"];
  if (game === undefined) return;
  if ("winner" in game) ranking.update(gameState);
  for(const response in resps) {
      resps[response].write('data: '+ JSON.stringify(game) +'\n\n');
  }
}

module.exports.get = function () {
  return responses;
}