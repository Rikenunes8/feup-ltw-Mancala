const fs = require('fs');
const model = require('./model.js');
const update = require('./update.js');
const {endResponse, endResponseWithError, setHeaders} = require('./utils.js');

const registerFile = "register.json";
const encoding = "utf8";

module.exports.notify = function(request, response) {
  setHeaders(response, 'plain');
  let data = '';
  let json = {};

  request.on('data', (chunk) => { data += chunk; });
  request.on('end', () => {
    try {
      json = JSON.parse(data);
      if (!'nick' in json) {
        endResponseWithError(response, 401, "nick is undefined");
        return;
      }
      if (!'password' in json) {
        endResponseWithError(response, 401, "password is undefined");
        return;
      }

      const nick = json['nick'];
      const pass = json['password'];
      const game = json['game'];
      const move = json['move'];

      fs.readFile(registerFile, encoding, (err, data) => {
        if (!err) {
          const registers = JSON.parse(data);
          const registered = nick in registers;

          if (!registered || pass != registers[nick]) {
            endResponseWithError(response, 401, "User registered with a different password");
          }
          else {
            if (!model.hasGame(game)) {
              endResponseWithError(response, 400, "No game found with id:"+game);
            }
            else if (!('move' in json)){
              endResponseWithError(response, 400, "move expected");
            }
            else if (isNaN(move)) {
              endResponseWithError(response, 400, "Invalid move:" + move);
            }
            else if (!model.isTurn(game, nick)) {
              endResponseWithError(response, 400, "Not your turn to play");
            }
            else if (!model.inSide(game, move)) {
              endResponseWithError(response, 400, "invalid start position: "+move);
            }
            else {
              if (!model.play(game, move)) {
                endResponseWithError(response, 400, "invalid empty pit: "+move);
              }
              else {
                endResponse(response, 200, {});
                update.update(game);
              }
            }
          }
        }
        else {
          endResponseWithError(response, 500, "Unable to read register json file");
        }
      });
    }
    catch(err) {
      endResponseWithError(response, 400, "Error parsing JSON request: " + err.message);
    }
  });
  request.on('error', () => {
    endResponseWithError(response, 400, "Error parsing JSON request: " + err.message);
  });
}

