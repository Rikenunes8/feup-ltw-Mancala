const fs = require('fs');
const {endResponse, endResponseWithError, setHeaders} = require('./utils.js');

const file = "ranking.json";
const encoding = "utf8";

module.exports.update = function (game) {
  if (game == undefined) return;
  if (game.players.length != 2) return;
  if (game.rankSaved === undefined) game.rankSaved = true;
  else return;
  addGame(game.players[0],game.players[1], game.game.winner);
}

function addGame(nick1, nick2, winner) {
  try {
    fs.readFile(file, encoding, (err, data) => {
      if (!err) {
        const obj = JSON.parse(data.toString());
        const ranking = obj.ranking;
        let players = {[nick1]:null,[nick2]:null}
        for (const player of ranking) {
          if (player.nick === nick1 || player.nick === nick2) {
            delete players[player.nick];
            player.games++;
            if (player.nick === winner) player.victories++;
            if (Object.keys(players).length === 0) break;
          }
        }
        for (const player in players) {
          ranking.push({
            "nick": player,
            "victories": player===winner? 1:0,
            "games": 1
          });
        }
        fs.writeFile(file, JSON.stringify(obj), (err) => {
          if (err) console.log("Unable to write register json file: "+err);
        });
      }
      else {
        console.log(err);
      }
    });
  }
  catch(err) {
    console.log(err);
  }
}

module.exports.getTop10 = function(request, response) {
  setHeaders(response, 'plain');
  let data = '';

  request.on('data', (chunk) => { data += chunk; })
  request.on('end', () => {
    try {     
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
      endResponseWithError(response, 400, "Error parsing JSON request: " + err);
    }
  });
  request.on('error', (err) => {
    endResponseWithError(response, 400, "Error parsing JSON request: " + err);
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
