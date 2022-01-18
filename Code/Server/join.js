const fs = require('fs');
const crypto = require('crypto');
const {endResponse, endResponseWithError} = require('./utils.js');

const file = "join.json";
const registeFile = "register.json";
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
      console.log(json);
      const nick = json['nick'];
      const pass = json['password'];

      fs.readFile(registeFile, encoding, (err, data) => {
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
            const d = Math.floor(Date.now() / 100000);
            const value = json["group"] + '_' + json["size"] + '_' + d + '_' + json["initial"];
            const hash = crypto.createHash('md5').update(value).digest('hex');
            endResponse(response, 200, {"game": hash});
            /*
            if (!alreadyRegistered) {
              registers[nick] = pass;
              fs.writeFile(file, JSON.stringify(registers), (err) => {
                if (!err) endResponse(response, 200, {});
                else endResponseWithError(response, 500, "Unable to write register json file");
              });
            }
            else {
              endResponse(response, 200, {});
            }*/
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

