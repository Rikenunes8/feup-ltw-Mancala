const fs = require('fs');
const rankingFile = "ranking.json";
// const mediaType = getMediaType(pathname);
// const encoding = isText(mediaType) ? "utf8" : null;
const encoding = "utf8";



function get(request, response) {
  let data = '';

  request.on('data', (chunk) => { data += chunk; })
  request.on('end', () => {
    try {
      if (data != '{}') {
        response.writeHead(400);
        response.write(JSON.stringify({error: "Unexpected parameters on JSON request"}));
        response.end();
      }
      else {
        fs.readFile(rankingFile, encoding, (err, data) => {
          if (!err) {
            const obj = JSON.parse(data.toString());
            const ranking = sortRanking(obj.ranking);
            const top10 = { "ranking": ranking.slice(0, 10) };
            response.writeHead(200);
            response.write(JSON.stringify(top10));
            response.end();
          }
          else {
            response.writeHead(500);
            response.write(JSON.stringify({error: "Unable to read ranking json file"}));
            response.end();
          }
        });
      }
    }
    catch(err) {
      response.writeHead(400);
      response.write(JSON.stringify({error: err.message}));
      response.end();
    }
  });
  request.on('error', () => {
    response.writeHead(400);
    response.write(JSON.stringify({error: err.message}));
    response.end();
  });
}

function sortRanking(ranking) {
  ranking.sort(function(a, b) {
    if      (a.vicotries < b.vicotries) return -1;
    else if (a.vicotries > b.vicotries) return  1;
    else if (a.games < b.games) return  1;
    else if (a.games > b.games) return -1;
    else return a.nick > b.nick;
  })
  return ranking;
}

module.exports = {get}