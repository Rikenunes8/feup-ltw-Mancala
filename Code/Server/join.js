const fs = require('fs');
const crypto = require('crypto');
const {endResponse, endResponseWithError} = require('./utils.js');

const gamesFile = "games.json";
const registerFile = "register.json";
const encoding = "utf8";

module.exports.join = function(request, response) {
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
            if (isNaN(json["size"])) {
              endResponseWithError(response, 400, "Invalid size: " + json["size"]);
              return;
            }
            if (isNaN(json["initial"])) {
              endResponseWithError(response, 400, "Invalid initial: " + json["initial"]);
              return;
            }
            createGame(response, json, 0);
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



function createGame(response, json, count) {
  const nick = json['nick'];
  const d = Math.floor(Date.now() / 100000);
  const value = json["group"] + '_' + json["size"] + '_' + d + '_' + json["initial"] + '_' + count;
  const hash = crypto.createHash('md5').update(value).digest('hex');

  fs.readFile(gamesFile, encoding, (err, data) => {
    if (!err) { 
      const games = JSON.parse(data);
      const pits = new Array(json['size']).fill(json['initial']);
      
      if (!(hash in games)) {
        games[hash] = {
            "board": {
              "sides": { 
                [nick]: { 
                  "pits": pits, 
                  "store":0 
                } 
              }, 
              "turn": nick
            }, 
            "stores": { 
              [nick]: 0
            }
          }

        fs.writeFile(gamesFile, JSON.stringify(games), (err) => {
          if (!err) endResponse(response, 200, { "game":hash });
          else endResponseWithError(response, 500, "Unable to write games json file");
        });
      }
      else if (Object.keys(games[hash].board.sides).length == 1) {
        if (nick in games[hash].board.sides) {
          endResponse(response, 200, { "game":hash });
        }
        else {
          games[hash].board.sides[nick] = { 
            "pits":pits, 
            "store":0 
          };
          games[hash].stores[nick] = 0;

          fs.writeFile(gamesFile, JSON.stringify(games), (err) => {
            if (!err) endResponse(response, 200, { "game":hash });
            else endResponseWithError(response, 500, "Unable to write games json file");
          });
        }
      }
      else {
        createGame(response, json, count+1);
      }
    }
    else {
      endResponseWithError(response, 500, "Unable to read games json file");
    }
  });
}

