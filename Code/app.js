function appBuilidRankingTable(tableData) {
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

function appRegister(response, nick, pass) {  
  if (response.error == null) {
    setMessage("You are now logged in " + nick);
    
    // Set logged in environment
    buttonPressed("#btn-login", "#login-window");
    const elems_notlog = document.querySelectorAll(".not-logged");
    const elems_log = document.querySelectorAll(".logged:not(#btn-logout, #btn-logout-username)");
    const btn_logout = document.querySelector("#btn-logout");
    const btn_logout_username = document.querySelector("#btn-logout-username");
    btn_logout_username.innerHTML = nick;
    
    for (let elem of elems_notlog)
      elem.style.display = "none";
    for (let elem of elems_log)
      elem.style.display = "block";
    btn_logout.style.display = "inline-block";
    btn_logout_username.style.display = "inline-block";
    
  }
  else {
    setMessage(response.error);
  }
}

function appJoin(response) {
  let game;
  if (response.error == null) {
    game = response.game;
    setMessage("Waitting to join game: "+ game);
  }
  else {
    setMessage(response.error);
  }
}

function appLeave(response) {
  if (response.error == null) {
    setMessage("Leaving the game");
  }
  else {
    setMessage(response.error);
  }
}


function setMessage(str) {
  let messagesBox = document.querySelector("#message_box");
  messagesBox.innerHTML = str;
}


window.addEventListener("load", function() {
  setMessage("Please login, set your game and press START");
  let nPits = document.querySelector("#n_p input").value;
  new BoardReal(0, nPits);
  //ranking();
  //register("group85", "82");
  //join("85", "group85", "85", 6, 4);
  //setTimeout(()=>function(){}, 2000);
  //leave("a752e34c33244ce0365209bb2d724d57", "group85", "85")
});