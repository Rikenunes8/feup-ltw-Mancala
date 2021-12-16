function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  }
  else {
    return Promise.reject(new Error('Invalid status'));
  }
}

function join(group, nick, pass, size, initial) {

}

function leave(game, nick, pass) {

}

function notify(nick, pass, game, move) {

}

function ranking(){
  fetch("http://twserver.alunos.dcc.fc.up.pt:8008/ranking", {
    method: 'POST',
    body: "{}"
  })
  .then(checkStatus)
  .then(response => response.json())
  .then(response => builidRankingTable(response))
  .catch(console.log);
}

function register(nick, pass) {

}

function update(game, nick) {

}