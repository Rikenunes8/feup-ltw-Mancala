class App {
  constructor() {
    this.server = "http://twserver.alunos.dcc.fc.up.pt:8008/";
    this.group = '15';
    this.gameHash = null;
    this.game = null;
    this.eventSource = null;
    this.localRanking = new RankingLocal();

    setMessage("Please login, set your game and press START");
    let nPits = document.querySelector("#n_p input").value;
    new BoardReal(0, nPits);
  }
  setUser(username) {this.username = username;}
  setPass(password) {this.password = password;}
  setGame(game) {this.game = game;}

  initGame() {
    this.gameHash = null;
    this.game = null;
    this.eventSource = null;

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
      let p1 = new PlayerHuman(this.username);
      let p2 = new PlayerAI(board, aiLevel);
      this.game = new Game(board, p1, p2, playFirst, true);
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
    let win = this.game.endGame(winner);
    if (this.game.hasBot) {
      this.localRanking.update(this.game.players[1].getLevel(), win==1);
      builidRankingTable(this.localRanking.ranks, "AI Level");
      this.ranking();
    }
    this.game = null;

    this.updateEnd();
    openCloseGame(false);
    this.makeNotPlayable();
  }

  ranking() {
    fetch(this.server + "ranking", {
      method: 'POST',
      body: "{}"
    })
    .then(response => response.json())
    .then(json => builidRankingTable(json, "Nick"))
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
    let obj = {"nick": nick, "password": pass};
  
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
    let obj = {"group":group, "nick": nick, "password": pass, "size": size, "initial": initial};
  
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
        console.log("Waitting to join game: "+ this.gameHash);
        this.update(this.gameHash, this.username);
      }
    })
    .catch(console.log);
  }

  leave(game, nick, pass) {
    let obj = {"game": game, "nick": nick, "password": pass};
  
    fetch(this.server + "leave", {
      method: 'POST',
      body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(json => {
      if (json.error != null) {
        console.log(json.error);
      }
      else {
        console.log("Leaving the game");
      }
    })
    .catch(console.log);
  }

  notify(nick, pass, game, move) {
    let obj = {"nick": nick, "password": pass, "game": game, "move": move};
  
    fetch(this.server + "notify", {
      method: 'POST',
      body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(json => {
      if (json.error != null) {
        console.log(json.error);
      }
      else {
        console.log("Notifying the game");
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
    if (!this.eventSource) return;
    this.eventSource.close();
    this.eventSource = null;
  }
  updateAction(data) {
    console.log(data);
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
        this.game = new Game(board, p1, p2, data.board.turn == this.username, false);
        this.makePlayable(p1);
      }
      else if ('pit' in data) {
        /*let p1Badge = document.querySelector('#p1-badge');
        let p2Badge = document.querySelector('#p2-badge');
        const p1Name = this.game.players[0].name;
        const p2Name = this.game.players[1].name;
        p1Badge.innerHTML = p1Name + ': ' + data.board.sides[p1Name].store;
        p2Badge.innerHTML = p2Name + ': ' + data.board.sides[p2Name].store;*/
        this.game.players[this.game.turn].setNextMove(data.pit);
        this.game.playRound(this.game.turn);
      }
      
    }
    if ('winner' in data){
      this.endGame(data.winner);
    }

  }

  makePlayable(player) {
    const pits = document.querySelectorAll("#zone-p1 .pit-info .pit");
    let that = this;
    for(let i = 0; i < pits.length; i++)
      pits[i].addEventListener("click", function() {
        if (that.game.hasBot) {
          player.setNextMove(i);
          that.game.playRound(0);
          setTimeout(()=> {if (that.game !== null && !that.game.running) that.endGame();}, 2500);
        }
        else {
          that.notify(that.username, that.password, that.gameHash, i);
        }
      });
  }
  makeNotPlayable() {
    let zoneP1 = document.querySelector("#zone-p1");
    let clone = zoneP1.cloneNode(true);
    zoneP1.parentNode.replaceChild(clone, zoneP1);

  }
}


function builidRankingTable(tableData, label) {
  let table = document.querySelector("#ranking-window .table");
  table.innerHTML = "";

  let tableHeader = document.createElement('div');
  tableHeader.setAttribute('class', 'table-header');
  let titles = [label, "Wins", "Games"];
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener("load", function() {
  const app = new App();
  initButtons(app);
  app.ranking();
});