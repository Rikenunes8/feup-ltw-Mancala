const fs = require('fs');
const {endResponse, endResponseWithError} = require('./utils.js');

const file = "ranking.json";
const encoding = "utf8";




module.exports.get = function(request, response) {
  let data = '';

  request.on('data', (chunk) => { data += chunk; })
  request.on('end', () => {
    try {
      /*
      if (data != '{}') {
        endResponseWithError(response, 400, "Unexpected parameters on JSON request");
        return;
      }
      */
      
      fs.readFile(file, encoding, (err, data) => {
        if (!err) {
          const obj = JSON.parse(data.toString());
          const ranking = sortRanking(obj.ranking);
          const top10 = { "ranking": ranking.slice(0, 10) };
          endResponse(response, 200, top10)
        }
        else {
          endResponseWithError(response, 500, "Unable to read ranking json file");
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

function sortRanking(ranking) {
  ranking.sort(function(a, b) {
    if      (a.victories < b.victories) return  1;
    else if (a.victories > b.victories) return -1;
    else if (a.games < b.games) return -1;
    else if (a.games > b.games) return  1;
    else return a.nick > b.nick;
  })
  return ranking;
}
