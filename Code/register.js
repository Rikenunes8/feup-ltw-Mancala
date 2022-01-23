const fs = require('fs');
const {endResponse, endResponseWithError, setHeaders} = require('./utils.js');

const file = "register.json";
const encoding = "utf8";

module.exports.login = function(request, response) {
  setHeaders(response, 'plain');
  let data = '';
  let json = {};

  request.on('data', (chunk) => { data += chunk; });
  request.on('end', () => {
    try {
      json = JSON.parse(data);
      if (!'nick' in json) {
        endResponseWithError(response, 400, "nick is undefined");
        return;
      }
      if (!'password' in json) {
        endResponseWithError(response, 400, "password is undefined");
        return;
      }

      const nick = json['nick'];
      const pass = json['password'];
      
      if (typeof nick !== 'string') {
        endResponseWithError(response, 400, "nick is not a valid string");
        return;
      }
      if (typeof pass !== 'string') {
        endResponseWithError(response, 400, "password is not a valid string");
        return;
      }

      fs.readFile(file, encoding, (err, data) => {
        if (!err) {
          const registers = JSON.parse(data);
          const alreadyRegistered = nick in registers;

          if (alreadyRegistered && pass != registers[nick]) {
            endResponseWithError(response, 400, "User registered with a different password");
          }
          else {
            if (!alreadyRegistered) {
              registers[nick] = pass;
              fs.writeFile(file, JSON.stringify(registers), (err) => {
                if (!err) endResponse(response, 200, {});
                else endResponseWithError(response, 500, "Unable to write register json file");
              });
            }
            else {
              endResponse(response, 200, {});
            }
          }
        }
        else {
          endResponseWithError(response, 500, "Unable to read register json file");
        }
      });
    }
    catch(err) {
      endResponseWithError(response, 400, "Error parsing JSON request: " + err);
    }
  });
  request.on('error', () => {
    endResponseWithError(response, 400, "Error parsing JSON request: " + err);
  });
}

