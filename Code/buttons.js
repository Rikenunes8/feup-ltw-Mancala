/*class Button {
  constructor(btn, win, bgColor) {
    this.btn = document.querySelector('#'+btn);
    this.win = document.getElementById('#'+win);
    this.showing = false;
    this.bgColor = bgColor;
    this.onclick = this.showHideWindow();
  }
  showHideWindow(btns) {
    let show = this.showing;
    for (let b of btns) {
      if (b.showing)
        b.hideWindow();
    }

    if (show) this.showWindow();
    else      this.hideWindow();
  }
  showWindow() {
    this.btn.style.backgroundColor = this.bgColor;
    this.win.style.display = "inline-block";
    this.showing = true;
  }
  hideWindow() {
    this.btn.style.backgroundColor = "rgba(255, 255, 255, 0.0)";
    this.wd.style.display = "none";
    this.showing = false;
  }
}

window.onload = function() {
  const btn_login = new Button('btn-login', 'login-window', 'wheat');
  const btn_logout = new Button('btn-logout', null, 'wheat');
  const btn_settings = new Button('btn-settings', 'settings-window', 'burlywood');
  const btn_help = new Button('btn-help', 'help-window', 'burlywood');
  const btn_ranking = new Button('btn-ranking', 'ranking-window', 'burlywood');
  const btn_start = new Button('btn-start', null, 'burlywood');
  const btn_stop = new Button('btn-stop', null, 'burlywood');
  const buttons = [btn_login, btn_logout, btn_settings, btn_help, btn_ranking, btn_start, btn_stop];
}*/

function makeLogin() {
  btnlogin.showWindow();
  const elems_notlog = document.querySelectorAll(".not-logged");
  const elems_log = document.querySelectorAll(".logged");
  
  for (let elem of elems_notlog) {
    elem.style.display = "none";
  }
  
  for (let elem of elems_log) {
    elem.style.display = "block";
  }
}

function makeLogout() {
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
  const btn = document.getElementById(button);
  const win = document.getElementById(window);
  let hide = getComputedStyle(win).display == "none";
  

  if (show) this.showWindow();
  else      this.hideWindow();
}
function showWindow(btn, win) {
  btn.style.backgroundColor = "burlywood";
  win.style.display = "inline-block";
}
function hideWindow(btn, win) {
  btn.style.backgroundColor = "rgba(255, 255, 255, 0.0)";
  win.style.display = "none";
}

  if (getComputedStyle(wd).display == "none") {
    btn.style.backgroundColor = "burlywood";
    wd.style.display = "inline-block";
  }
  else {
    btn.style.backgroundColor = "rgba(255, 255, 255, 0.0)";
    wd.style.display = "none";
  }