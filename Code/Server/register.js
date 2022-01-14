const fs = require('fs');
const {endResponse, endResponseWithError} = require('./utils.js');

const file = "register.json";
const encoding = "utf8";

module.exports.login = function(request, response) {
  let data = '';
  let json = {};

  request.on('data', (chunk) => { data += chunk; });
  request.on('end', () => {
    try {
      json = JSON.parse(data);
      let required = {'nick':null, 'pass':null};

      if (data == '{}') json.empty = null;
      for (const key in json) {
        if (!(key in required)) {
          endResponseWithError(response, 400, "Unexpected parameters on JSON request");
          return;
        }
        else {
          delete required[key];
        }
      }

      const nick = json['nick'];
      const pass = json['pass'];

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
      endResponseWithError(response, 400, err.message);
    }
  });
  request.on('error', () => {
    endResponseWithError(response, 400, err.message);
  });
}

