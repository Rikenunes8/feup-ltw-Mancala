function makeLogin() {
  showWindow('btn-login', 'login-window');
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


function showWindow(button, window) {
  const btn = document.getElementById(button);
  const wd = document.getElementById(window);
  if (getComputedStyle(wd).display == "none") {
    btn.style.backgroundColor = "burlywood";
    wd.style.display = "inline-block";
  }
  else {
    btn.style.backgroundColor = "rgba(255, 255, 255, 0.0)";
    wd.style.display = "none";
  }
}