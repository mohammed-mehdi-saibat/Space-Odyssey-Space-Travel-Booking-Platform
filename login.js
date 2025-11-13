"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const submitButton = document.getElementById("submitButton");
  const errorMessage = document.getElementById("errorMessage");

  fetch("./users.json")
    .then((response) => response.json())
    .then((users) => {
      localStorage.setItem("users", JSON.stringify(users));
    })
    .catch((error) => console.log("Error", error));

  submitButton.addEventListener("click", function (e) {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      showError("Please enter both email and password");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    let userFound = false;

    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email && users[i].password === password) {
        userFound = true;

        localStorage.setItem("currentUser", JSON.stringify(users[i]));

        users[i].isLoggedIn = true;
        localStorage.setItem("users", JSON.stringify(users));

        showSuccess("Login successful!...");

        setTimeout(function () {
          window.location.href = "index.html";
        }, 1500);

        break;
      }
    }

    if (!userFound) {
      showError("Invalid email or password!");
    }
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.color = "red";
    errorMessage.style.display = "block";

    setTimeout(function () {
      errorMessage.style.display = "none";
    }, 3000);
  }

  function showSuccess(message) {
    errorMessage.textContent = message;
    errorMessage.style.color = "green";
    errorMessage.style.display = "block";
    submitButton.textContent = "Success!";
    submitButton.style.background = "green";
  }
});
