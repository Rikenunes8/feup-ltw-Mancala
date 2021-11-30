window.addEventListener('load', function() {
  const logout = document.querySelector("#btn-logout");
  logout.addEventListener("click", function() {makeLogout();});
  const login = document.querySelector("#btn-login");
  login.addEventListener("click", function() {showHideWindow("#btn-login", "#login-window");});
  const submit_login = document.querySelector("#submit-login");
  submit_login.addEventListener("click", function () {makeLogin();});

  const help = document.querySelector("#btn-help");
  help.addEventListener("click", function() {showHideWindow("#btn-help", "#help-window");})
  const settings = document.querySelector("#btn-settings");
  settings.addEventListener("click", function() {showHideWindow("#btn-settings", "#settings-window");})
  const ranking = document.querySelector("#btn-ranking");
  ranking.addEventListener("click", function() {showHideWindow("#btn-ranking", "#ranking-window");})
}
);
function makeLogin() {
  const username = document.querySelector("#login-window input[type=text]");
  const password = document.querySelector("#login-window input[type=password]");

  showHideWindow("#btn-login", "#login-window");
  const elems_notlog = document.querySelectorAll(".not-logged");
  const elems_log = document.querySelectorAll(".logged:not(#btn-logout, #btn-logout-username)");
  const btn_logout = document.querySelector("#btn-logout");
  const btn_logout_username = document.querySelector("#btn-logout-username");
  btn_logout_username.innerHTML = username.value;
  
  for (let elem of elems_notlog)
    elem.style.display = "none";
  for (let elem of elems_log)
    elem.style.display = "block";
  btn_logout.style.display = "inline-block";
  btn_logout_username.style.display = "inline-block";

  username.value = "";
  password.value = "";
}

function makeLogout() {
  hideAllWindows();
  const elems_notlog = document.querySelectorAll(".not-logged");
  const elems_log = document.querySelectorAll(".logged");
  
  for (let elem of elems_log) {
    elem.style.display = "none";
  }
  for (let elem of elems_notlog) {
    elem.style.display = "block";
  }
}

function showHideWindow(button, window) {
  const btn = document.querySelector(button);
  const win = document.querySelector(window);
  let show = getComputedStyle(win).display == "none";
  
  hideAllWindows();

  if (show) this.showWindow(btn, win);
}
function showWindow(btn, win) {
  btn.style.backgroundColor = "burlywood";
  win.style.display = "inline-block";
}
function hideAllWindows() {
  const btns = document.querySelectorAll(".buttons button");
  const wins = document.querySelectorAll(".window");
  for (let b of btns)
    b.style.backgroundColor = "rgba(255, 255, 255, 0.0)";
  for (let w of wins)
    w.style.display = "none";
}