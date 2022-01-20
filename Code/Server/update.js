const model = require('./model.js');
const {endResponse, endResponseWithError, setHeaders} = require('./utils.js');


let responses = {};

module.exports.remember = function(response, hash, nick) {
    if (!model.hasGame(hash)) {
        endResponseWithError(response, 400, "Invalid game reference")
    }
    setHeaders(response, 'sse');
    response.writeHead(200);
    if (hash in responses) {
        console.log("second")
        responses[hash][nick] = response;
    }
    else {
        console.log("first")
        responses[hash] = {[nick]:response}
    }
    console.log("remember");
}

module.exports.forget = function(hash, nick) {
    console.log("Deleting responses", hash, nick)
    delete responses[hash][nick];
}

module.exports.update = function(hash) {
    const resps = responses[hash];
    const gameState = model.getGame(hash);
    const game = gameState["game"];
    if (game === undefined) return;
    for(const response in resps) {
        resps[response].write('data: '+ JSON.stringify(game) +'\n\n');
    }
}