"use strict";

function checkLogin() {
  const user = localStorage.getItem("currentUser");

  if (user) {
    const userData = JSON.parse(user);
    updateNavigation(userData.firstName);
  } else {
    updateNavigation(null);
  }
}

function updateNavigation(userName) {
  const loginButton = document.getElementById("LoginID");

  if (loginButton) {
    if (userName) {
      loginButton.textContent = `Logout (${userName})`;
      loginButton.style.color = "red";
      loginButton.onclick = function (e) {
        e.preventDefault();
        logout();
      };
    } else {
      loginButton.textContent = "Login";
      loginButton.style.color = "";
      if (loginButton.tagName === "A") {
        loginButton.href = "login.html";
      }
      loginButton.onclick = null;
    }
  }
}

function logout() {
  localStorage.removeItem("currentUser");

  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.forEach((user) => {
    user.isLoggedIn = false;
  });
  localStorage.setItem("users", JSON.stringify(users));

  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
});
