class App {
  constructor() {
    this.server = "http://twserver.alunos.dcc.fc.up.pt:8008/";
    this.group = '85';
    this.gameHash;
    this.game;
    this.eventSource;

    setMessage("Please login, set your game and press START");
    let nPits = document.querySelector("#n_p input").value;
    new BoardReal(0, nPits);
  }
  setUser(username) {this.username = username;}
  setPass(password) {this.password = password;}
  setGame(game) {this.game = game;}

  initGame() {
    let nSeeds = document.querySelector("#n_s input").value;
    let nPits = document.querySelector("#n_p input").value;
    let playFirst = document.querySelector("#play_first input").checked;
    let modes = document.querySelectorAll("#game_mode input");
    let gameMode;
    for (let i = 0; i < modes.length; i++) {
      if (modes[i].checked) {
        gameMode = i;
        break;
      }
    }
    let levels = document.querySelectorAll("#ai_level input");
    let aiLevel;
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].checked) {
        aiLevel = i+1;
        break;
      }
    }
  
    if (gameMode == 0) {
      let board = new BoardReal(nSeeds, nPits);
      let p1 = new PlayerHuman();
      let p2 = new PlayerAI(board, aiLevel);
      this.game = new Game(board, p1, p2, playFirst);
      makePlayable(p1, this.game);
    }
    else {
      this.join(this.group, this.username, this.password, nPits, nSeeds);
    }
  }

  appendGame() {
    this.game.endGame();
    this.eventSource.close();
  }

  ranking() {
    fetch(this.server + "ranking", {
      method: 'POST',
      body: "{}"
    })
    .then(response => response.json())
    .then(json => builidRankingTable(json))
    .catch(console.log);
  }

  register(nick, pass) {
    // TODO Remove Backdoor
    if (nick == '') {
      setLoggedEnv(nick);
      this.username = 'Unknown';
      this.password = pass
      return;
    } else if (nick == '1') {
      nick = 'group85';
      pass = '85';
    } else if (nick == '2') {
      nick = 'group_85';
      pass = '85';
    }
    // --------------------
    let obj = {"nick": nick, "password": pass};
  
    fetch(this.server + "register", {
      method: 'POST',
      body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(json => {
      if (json.error != null) {
        setMessage(json.error);
      }
      else {
        setMessage("You are now logged in " + nick);
        setLoggedEnv(nick);
        this.username = nick;
        this.password = pass
      }
      return json;
    })
    .catch(console.log);
  }

  join(group, nick, pass, size, initial) {
    let obj = {"group":group, "nick": nick, "password": pass, "size": size, "initial": initial};
  
    fetch(this.server + "join", {
      method: 'POST',
      body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(json => {
      if (json.error != null) {
        setMessage(json.error);
      }
      else {
        this.gameHash = json.game;
        setMessage("Waitting to join game: "+ this.gameHash);
        this.update(this.gameHash, this.username);
      }
    })
    .catch(console.log);
  }

  leave(game, nick, pass) {
    let obj = {"game": game, "nick": nick, "password": pass};
  
    fetch(this.server + "register", {
      method: 'POST',
      body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(json => {
      if (json.error != null) {
        setMessage(json.error);
      }
      else {
        setMessage("Leaving the game");
      }
    })
    .catch(console.log);
  }

  update(game, nick) {
    console.log(nick, game);
    let query = "?nick="+nick+"&game="+game;
    this.eventSource = new EventSource(this.server + "update" + query);
    this.eventSource.onopen = function() {
      console.log("connetion established");
    }
    let that = this;
    this.eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      that.updateAction(data);
    }
  }
  updateEnd() {
    this.eventSource.close();
    this.eventSource = null;
  }
  updateAction(data) {
    console.log(data);
  }
}

function makePlayable(player, game) {
  const pits = document.querySelectorAll("#zone-p1 .pit-info .pit");
  for(let i = 0; i < pits.length; i++)
    pits[i].addEventListener("click", function() {player.setNextPlay(i); game.playRound(0);});
}

function builidRankingTable(tableData) {
  let table = document.querySelector("#ranking-window .table");
  table.innerHTML = "";

  let tableHeader = document.createElement('div');
  tableHeader.setAttribute('class', 'table-header');
  let titles = ["Nick", "Wins", "Games"];
  for (let title of titles) {
    let node = document.createElement('div');
    node.setAttribute('class', 'table-item header-item');
    node.innerText = title;

    tableHeader.appendChild(node);
  }
  table.appendChild(tableHeader);
  

  let players = tableData.ranking;
  for (let player of players) {
    let tableRow = document.createElement('div');
    tableRow.setAttribute('class', 'table-row');
    let items = [player.nick, player.victories, player.games];
    for (let item of items) {
      let node = document.createElement('div');
      node.setAttribute('class', 'table-item');
      node.innerText = item;

      tableRow.appendChild(node);
    }
    table.appendChild(tableRow);
  }
}

function setMessage(str) {
  let messagesBox = document.querySelector("#message_box");
  messagesBox.innerHTML = str;
}

window.addEventListener("load", function() {
  let app = new App();
  initButtons(app);
  app.ranking();

  //join("85", "group85", "85", 6, 4);
  //setTimeout(()=>update(game, "group85"), 2000);

  //update("470422445dde14c553e0c3b68fcbcf7f", "group85");
  //leave("a752e34c33244ce0365209bb2d724d57", "group85", "85")
});