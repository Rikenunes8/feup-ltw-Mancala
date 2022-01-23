function initButtons(app) {
  const logout = document.querySelector("#btn-logout");
  const login = document.querySelector("#btn-login");
  const submit_login = document.querySelector("#submit-login");
  const help = document.querySelector("#btn-help");
  const settings = document.querySelector("#btn-settings");
  const ranking = document.querySelector("#btn-ranking");
  const switch_rank = document.querySelector("#switch-ranking");
  const start = document.querySelector("#btn-start");
  const stop = document.querySelector("#btn-stop");
  const servers = document.querySelectorAll(".server-option input");
  lockButton(stop);

  start.addEventListener("click", function() {openCloseGame(true); app.initGame();});
  stop.addEventListener("click", function() {openCloseGame(false); app.forceEndGame();});
  
  logout.addEventListener("click", function() { makeLogout(app, stop);});
  login.addEventListener("click", function() {buttonPressed("#btn-login", "#login-window");});
  submit_login.addEventListener("click", function () {makeLogin(app);});
  switch_rank.addEventListener("click", function () {switchRanking();})
  help.addEventListener("click", function() {buttonPressed("#btn-help", "#help-window");});
  settings.addEventListener("click", function() {buttonPressed("#btn-settings", "#settings-window");});
  ranking.addEventListener("click", function() {buttonPressed("#btn-ranking", "#ranking-window");});

  servers.forEach(server => {
    server.addEventListener("click", function() {
      app.setServer(this.value);
      logout.click();
    })
  });
}

function makeLogin(app) {
  const username = document.querySelector("#login-window input[type=text]");
  const password = document.querySelector("#login-window input[type=password]");
  const nick = username.value;
  const pass = password.value;

  app.register(nick, pass);
  app.resetGame();

  username.value = "";
  password.value = "";
}

function makeLogout(app, stop) {
  if (app.isGameRunning()) {
    stop.click();
  }
  hideAllWindows();
  const elems_notlog = document.querySelectorAll(".not-logged");
  const elems_log = document.querySelectorAll(".logged");
  
  for (const elem of elems_log) {
    elem.classList.remove('d-block');
    elem.classList.remove('d-inline-block');
    elem.classList.add('d-none');
  }
  for (const elem of elems_notlog) {
    elem.classList.remove('d-none');
    elem.classList.add('d-block');
  }
}

function switchRanking() {
  const rankingWindow = document.querySelector("#ranking-window");
  const tables = rankingWindow.querySelectorAll(".container div.table");
  for (const table of tables) {
    if (table.classList.contains('d-none')) {
      table.classList.remove('d-none');
      const title = rankingWindow.querySelector("div.window-title");
      const but = rankingWindow.querySelector("div.field div.submit");
      if (table.classList.contains('table-local')) {
        title.innerHTML = "Local Ranking";
        but.innerHTML = "Switch to Remote";
      }
      else {
        title.innerHTML = "Remote Ranking";
        but.innerHTML = "Switch to Local";
      }
    }
    else {
      table.classList.add('d-none');
    }
  }
}

function setLoggedEnv(nick) {
  buttonPressed("#btn-login", "#login-window");
  const elems_notlog = document.querySelectorAll(".not-logged");
  const elems_log = document.querySelectorAll(".logged:not(#btn-logout, #btn-logout-username)");
  const btn_logout = document.querySelector("#btn-logout");
  const btn_logout_username = document.querySelector("#btn-logout-username");
  btn_logout_username.innerHTML = nick;
  
  for (const elem of elems_notlog) {
    elem.classList.remove('d-block');
    elem.classList.remove('d-inline-block');
    elem.classList.add('d-none');
  }
  for (const elem of elems_log) {
    elem.classList.remove('d-none');
    elem.classList.add('d-block');
  }
  btn_logout.classList.remove('d-none');
  btn_logout.classList.add('d-inline-block');
  btn_logout_username.classList.remove('d-none');
  btn_logout_username.classList.add('d-inline-block');
}

function buttonPressed(button, window) {
  const btn = document.querySelector(button);
  const win = document.querySelector(window);
  const show = !btn.classList.contains("btn_selected");
  
  hideAllWindows();

  if (show) this.showWindow(btn, win);
}
function showWindow(btn, win) {
  btn.classList.add("btn_selected");
  win.classList.add("win_selected");
}
function hideAllWindows() {
  const btns = document.querySelectorAll(".btn_selected");
  const wins = document.querySelectorAll(".win_selected");

  for (const b of btns)
    b.classList.remove("btn_selected");
  for (const w of wins)
    w.classList.remove("win_selected");
}

function lockButton(btn) {
  btn.disabled = true;
}
function unlockButton(btn) {
  btn.disabled = false;
}

function openCloseGame(openClose) {
  const start = document.querySelector("#btn-start");
  const stop = document.querySelector("#btn-stop");
  const settings = document.querySelector("#btn-settings");
  hideAllWindows(); 
  if (openClose) {
    lockButton(settings); 
    lockButton(start); 
    unlockButton(stop); 
  }
  else {
    unlockButton(settings); 
    lockButton(stop); 
    unlockButton(start);
  }
}