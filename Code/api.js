function ranking(){
  fetch("http://twserver.alunos.dcc.fc.up.pt:8008/ranking", {
    method: 'POST',
    body: "{}"
  })
  .then(response => response.json())
  .then(response => appBuilidRankingTable(response))
  .catch(console.log);
}

function register(nick, pass) {
  let obj = {"nick": nick, "password": pass};
  
  fetch("http://twserver.alunos.dcc.fc.up.pt:8008/register", {
    method: 'POST',
    body: JSON.stringify(obj)
  })
  .then(response => response.json())
  .then(response => appRegister(response, nick, pass))
  .catch(console.log);
}

function join(group, nick, pass, size, initial) {
  let obj = {"group":group, "nick": nick, "password": pass, "size": size, "initial": initial};

  fetch("http://twserver.alunos.dcc.fc.up.pt:8008/join", {
    method: 'POST',
    body: JSON.stringify(obj)
  })
  .then(response => response.json())
  .then(response => appJoin(response))
  .catch(console.log);
}

function leave(game, nick, pass) {
  let obj = {"game": game, "nick": nick, "password": pass};

  fetch("http://twserver.alunos.dcc.fc.up.pt:8008/register", {
    method: 'POST',
    body: JSON.stringify(obj)
  })
  .then(response => response.json())
  .then(response => appLeave(response))
  .catch(console.log);
}

function notify(nick, pass, game, move) {

}

function update(game, nick) {

}