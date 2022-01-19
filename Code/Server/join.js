const fs = require('fs');
const model = require('./model.js');
const {endResponse, endResponseWithError, setHeaders} = require('./utils.js');

const registerFile = "register.json";
const encoding = "utf8";

module.exports.join = function(request, response) {
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
            hash = model.joinGame(nick, json['size'], json['initial'], json['group'], 0);
            endResponse(response, 200, { "game":hash });
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

