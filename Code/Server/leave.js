const fs = require('fs');
const crypto = require('crypto');
const {endResponse, endResponseWithError} = require('./utils.js');

const gamesFile = "games.json";
const registerFile = "register.json";
const encoding = "utf8";

module.exports.leave = function(request, response) {
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

      fs.readFile(registerFile, encoding, (err, data) => {
        if (!err) {
          const registers = JSON.parse(data);
          const registered = nick in registers;

          if (!registered || pass != registers[nick]) {
            endResponseWithError(response, 401, "User registered with a different password");
          }
          else {
            fs.readFile(gamesFile, encoding, (err, data) => {
              if (!err) {
                const games = JSON.parse(data);
                if (! (json['game'] in games)) {
                  endResponseWithError(response, 400, "Not a valid game");
                }
                else {
                  delete games[json['game']];
                  fs.writeFile(gamesFile, JSON.stringify(games), (err) => {
                    if (!err) endResponse(response, 200, {});
                    else endResponseWithError(response, 500, "Unable to write register json file");
                  });
                }
              }
              else {
                endResponseWithError(response, 500, "Unable to read games json file");
              }
            });
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

