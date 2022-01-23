class App {
  constructor() {
    this.servers = {
      "8008": "http://twserver.alunos.dcc.fc.up.pt:8008/",
      "8915": "http://twserver.alunos.dcc.fc.up.pt:9015/"
      // "8915": "http://localhost:9015/"
    }
    this.server = this.servers["8008"];
    this.group = '15';
    this.localRanking = new RankingLocal();

    this.resetGame();
  }
  setUser(username) {this.username = username;}
  setPass(password) {this.password = password;}
  setGame(game) {this.game = game;}
  setServer(server) {this.server = this.servers[server]; this.ranking();}

  isGameRunning() {
    return this.game !== null;
  }

  resetGame() {
    this.gameHash = null;
    this.game = null;
    this.eventSource = null;

    setMessage("Please login, set your game and press START");
    updateBoardInfo(null);
    const nPits = document.querySelector("#n_p input").value;
    new BoardReal(0, nPits);
  }
  
  initGame() {
    this.gameHash = null;
    this.game = null;
    this.eventSource = null;

    const nSeedsElem = document.querySelector("#n_s input");
    const nSeeds = Math.max(nSeedsElem.min, Math.min(nSeedsElem.max, nSeedsElem.value));
    nSeedsElem.value = nSeeds;

    const nPitsElem = document.querySelector("#n_p input");
    const nPits = Math.max(nPitsElem.min, Math.min(nPitsElem.max, nPitsElem.value));
    nPitsElem.value = nPits;
    
    const playFirst = document.querySelector("#play_first input").checked;
    const modes = document.querySelectorAll("#game_mode input");
    let gameMode;
    for (let i = 0; i < modes.length; i++) {
      if (modes[i].checked) {
        gameMode = i;
        break;
      }
    }
    const levels = document.querySelectorAll("#bot_level input");
    let botLevel;
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].checked) {
        botLevel = i+1;
        break;
      }
    }

    const aiLevelElem = document.querySelector("#ai_level input");
    const aiLevel = Math.max(aiLevelElem.min, Math.min(aiLevelElem.max, aiLevelElem.value));
    aiLevelElem.value = aiLevel;
  
    if (gameMode == 0) {
      let board = new BoardReal(nSeeds, nPits);
      let p1 = new PlayerHuman(this.username);
      let p2 = new PlayerAI(board, botLevel, aiLevel);
      this.game = new Game(board, p1, p2, playFirst, true, this);
      this.makePlayable(p1);
    }
    else {
      this.join(this.group, this.username, this.password, nPits, nSeeds);
    }
  }
  forceEndGame() {
    if (this.gameHash) {
      this.leave(this.gameHash, this.username, this.password);
    }
    else {
      this.endGame(this.game.getPlayerName(1));
    }
  }
  endGame(winner) {
    if (this.game !== null) {
      const win = this.game.endGame(winner);
      if (this.game.hasBot) {
        this.localRanking.update(this.game.players[1].getLevel(), win==1);
        builidRankingTable(this.localRanking.ranks, true);
      }
      else {
        this.ranking();
      }
    }
    else if (this.eventSource !== null) {
      setMessage("Please login, set your game and press START");
    }
    this.updateEnd();
    openCloseGame(false);
    this.makeNotPlayable();
    this.game = null;
  }

  ranking() {
    fetch(this.server + "ranking", {
      method: 'POST',
      body: "{}"
    })
    .then(response => response.json())
    .then(json => builidRankingTable(json, false))
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
      nick = 'group15';
      pass = '15';
    } else if (nick == '2') {
      nick = 'group_15';
      pass = '15';
    }
    // --------------------
    const obj = {"nick": nick, "password": pass};
  
    fetch(this.server + "register", {
      method: 'POST',
      body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(json => {
      if (json.error != null) {
        console.log(json.error);
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
    const obj = {"group":group, "nick": nick, "password": pass, "size": size, "initial": initial};
  
    fetch(this.server + "join", {
      method: 'POST',
      body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(json => {
      if (json.error != null) {
        console.log(json.error);
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
    const obj = {"game": game, "nick": nick, "password": pass};
  
    fetch(this.server + "leave", {
      method: 'POST',
      body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(json => {
      if (json.error != null) {
        console.log(json.error);
      }
    })
    .catch(console.log);
  }

  notify(nick, pass, game, move) {
    const obj = {"nick": nick, "password": pass, "game": game, "move": move};
  
    fetch(this.server + "notify", {
      method: 'POST',
      body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(json => {
      if (json.error != null) {
        console.log(json.error);
      }
    })
    .catch(console.log);
  }

  update(game, nick) {
    const query = "?nick="+nick+"&game="+game;
    this.eventSource = new EventSource(this.server + "update" + query);
    this.eventSource.onopen = function() {
      //
    }
    const that = this;
    this.eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      that.updateAction(data);
    }
  }
  updateEnd() {
    if (!this.eventSource) return;
    this.eventSource.close();
    this.eventSource = null;
  }
  updateAction(data) {
    if ('error' in data) {
      setMessage(data.error);
    }
    if ('board' in data){
      if (this.game == null) {
        const sides = data.board.sides;
        const nPits = sides[this.username].pits.length;
        const nSeeds = sides[this.username].pits[0];
        let board = new BoardReal(nSeeds, nPits);
        let p1 = new PlayerHuman(this.username);
        
        let p2Name;
        for (const key in sides) if (key != this.username) p2Name = key;
        let p2 = new PlayerHuman(p2Name);
        this.game = new Game(board, p1, p2, data.board.turn == this.username, false, this);
        this.makePlayable(p1);
      }
      else if ('pit' in data) {
        this.game.play(this.game.turn, data.pit);
      }
      
    }
    if ('winner' in data) {
      this.endGame(data.winner);
    }

  }

  makePlayable(player) {
    const pits = document.querySelectorAll("#zone-p1 .pit-info .pit");
    const that = this;
    for(let i = 0; i < pits.length; i++)
      pits[i].addEventListener("click", function() {
        if (that.game.hasBot) {
          player.play(i);
        }
        else {
          that.notify(that.username, that.password, that.gameHash, i);
        }
      });
  }
  makeNotPlayable() {
    const zoneP1 = document.querySelector("#zone-p1");
    const clone = zoneP1.cloneNode(true);
    zoneP1.parentNode.replaceChild(clone, zoneP1);

  }
}


function builidRankingTable(tableData, isLocal) {
  let label; let tableClass;
  if (isLocal) {
    label = "AI Level";
    tableClass = 'table-local';
  }
  else {
    label = "Nick";
    tableClass = 'table-remote';
  }
  let table = document.querySelector("#ranking-window ."+tableClass);
  table.innerHTML = "";

  let tableHeader = document.createElement('div');
  tableHeader.setAttribute('class', 'table-header');
  const titles = [label, "Wins", "Games"];
  for (const title of titles) {
    let node = document.createElement('div');
    node.setAttribute('class', 'table-item header-item');
    node.innerText = title;

    tableHeader.appendChild(node);
  }
  table.appendChild(tableHeader);
  

  const players = tableData.ranking;
  for (const player of players) {
    let tableRow = document.createElement('div');
    tableRow.setAttribute('class', 'table-row');
    const items = [player.nick, player.victories, player.games];
    for (const item of items) {
      let node = document.createElement('div');
      node.setAttribute('class', 'table-item');
      node.innerText = item;

      tableRow.appendChild(node);
    }
    table.appendChild(tableRow);
  }
}

function setMessage(msg) {
  let messagesBox = document.querySelector("#message_box span");
  messagesBox.innerHTML = msg;
}

function updateBoardInfo(players) {
  const name1 = document.querySelector("#p1-badge div:first-child b");
  const name2 = document.querySelector("#p2-badge div:first-child b");
  const score1 = document.querySelector("#p1-badge div:last-child");
  const score2 = document.querySelector("#p2-badge div:last-child");
  if (players === null) {
    name1.innerHTML = 'Player 1';
    name2.innerHTML = 'Player 2';
    score1.innerHTML = 'Score: 0';
    score2.innerHTML = 'Score: 0';
  } else {
    const p1 = players[0];
    const p2 = players[1];
    name1.innerHTML = p1.getName();
    name2.innerHTML = p2.getName();
    score1.innerHTML = 'Score: ' + p1.getScore();
    score2.innerHTML = 'Score: ' + p2.getScore();
  }

}

window.addEventListener("load", function() {
  const app = new App();
  initButtons(app);
  app.ranking();
  builidRankingTable(app.localRanking.ranks, true);
});