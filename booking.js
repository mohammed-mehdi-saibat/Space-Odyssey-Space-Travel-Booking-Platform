"use strict";

let currentBooking = {
  destination: null,
  passengers: 1,
  totalPrice: 0,
};

document.addEventListener("DOMContentLoaded", function () {
  console.log("Booking page loaded!");
  loadDestinations();
  setupPriceCalculators();
  setupFormValidation();
});

function loadDestinations() {
  fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      addDestinationsToDropdown(data.destinations);
    })
    .catch((error) => {
      console.log("Error loading destinations:", error);
    });
}

function addDestinationsToDropdown(destinations) {
  const destinationSelect = document.getElementById("destination");

  destinations.forEach((destination) => {
    const option = document.createElement("option");
    option.value = destination.id;
    option.textContent = destination.name;
    destinationSelect.appendChild(option);
  });

  destinationSelect.addEventListener("change", function () {
    showDestinationDetails(this.value, destinations);
    currentBooking.destination = this.value;
    calculateTotalPrice(destinations);
  });
}

function showDestinationDetails(selectedDestinationId, destinations) {
  const selectedDestination = destinations.find(
    (dest) => dest.id === selectedDestinationId
  );

  if (!selectedDestination) return;

  const packageSection = document.getElementById("package-section");

  let detailsHTML = `
    <div class="bg-space-purple/30 p-6 rounded-lg border border-neon-blue/20">
      <h3 class="font-orbitron text-xl text-neon-cyan mb-4">${
        selectedDestination.name
      } Journey</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-gray-300"><span class="text-neon-blue">Duration:</span> ${
            selectedDestination.travelDuration
          }</p>
          <p class="text-gray-300"><span class="text-neon-blue">Distance:</span> ${
            selectedDestination.distance
          }</p>
          <p class="text-gray-300"><span class="text-neon-blue">Gravity:</span> ${
            selectedDestination.gravity
          }</p>
        </div>
        <div>
          <p class="text-gray-300"><span class="text-neon-blue">Temperature:</span> ${
            selectedDestination.temperature
          }</p>
          <p class="text-gray-300"><span class="text-neon-blue">Best Time:</span> ${
            selectedDestination.bestTimeToVisit
          }</p>
          <p class="text-2xl font-orbitron text-neon-cyan mt-2">Base Price: $${selectedDestination.price.toLocaleString()}</p>
        </div>
      </div>
      <p class="text-gray-300 mt-4 text-sm">${
        selectedDestination.shortDescription
      }</p>
    </div>
  `;

  packageSection.innerHTML = detailsHTML;
}

function setupPriceCalculators() {
  const passengerRadios = document.querySelectorAll('input[name="passengers"]');
  passengerRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "solo") currentBooking.passengers = 1;
      if (this.value === "couple") currentBooking.passengers = 2;
      if (this.value === "group") currentBooking.passengers = 4;
      calculateTotalPrice();
    });
  });

  const accommodationOptions = document.querySelectorAll(
    ".accommodation-option"
  );
  accommodationOptions.forEach((option) => {
    option.addEventListener("click", function () {
      document.querySelectorAll(".accommodation-option").forEach((opt) => {
        opt.classList.remove("selected");
      });

      this.classList.add("selected");

      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        currentBooking.accommodation = radio.value;
        calculateTotalPrice();
      }
    });
  });

  const defaultAccommodation = document.querySelector(
    'input[name="cabin"]:checked'
  );
  if (defaultAccommodation) {
    currentBooking.accommodation = defaultAccommodation.value;
  }
}

function calculateTotalPrice(destinations) {
  if (!currentBooking.destination) {
    updatePriceDisplay(0);
    return;
  }

  fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      const selectedDestination = data.destinations.find(
        (dest) => dest.id === currentBooking.destination
      );

      if (!selectedDestination) return;

      let basePrice = selectedDestination.price;
      let total = basePrice * currentBooking.passengers;

      if (currentBooking.accommodation === "luxury") {
        total += 10000 * currentBooking.passengers;
      } else if (currentBooking.accommodation === "zero-g") {
        total += 20000 * currentBooking.passengers;
      }

      currentBooking.totalPrice = total;
      updatePriceDisplay(total);
    });
}

function updatePriceDisplay(price) {
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.innerHTML = `Confirm Booking - $${price.toLocaleString()}`;
  }

  currentBooking.totalPrice = price;
  console.log("Current booking:", currentBooking);
}

function setupFormValidation() {
  const submitButton = document.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.addEventListener("click", function (e) {
      e.preventDefault();
      validateForm();
    });
  }
}

function validateForm() {
  clearErrors();

  let isValid = true;

  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const date = document.getElementById("departure-date");

  if (!firstName.value) {
    showError(firstName, "First name is required");
    isValid = false;
  }

  if (!lastName.value) {
    showError(lastName, "Last name is required");
    isValid = false;
  }

  if (!email.value) {
    showError(email, "Email is required");
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    showError(email, "Please enter a valid email");
    isValid = false;
  }

  if (!phone.value) {
    showError(phone, "Phone number is required");
    isValid = false;
  } else if (!isValidPhone(phone.value)) {
    showError(phone, "Please enter a valid phone number");
    isValid = false;
  }

  if (!date.value) {
    showError(date, "Departure date is required");
    isValid = false;
  }

  if (!currentBooking.destination) {
    alert("Please select a destination");
    isValid = false;
  }

  if (isValid) {
    saveBooking();
  }

  return isValid;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex =
    /^(06|07)[\s]?[\d]{2}[\s]?[\d]{2}[\s]?[\d]{2}[\s]?[\d]{2}$/;
  return phoneRegex.test(phone);
}

function showError(field, message) {
  field.style.borderColor = "red";

  const errorDiv = document.createElement("div");
  errorDiv.style.color = "red";
  errorDiv.style.fontSize = "14px";
  errorDiv.style.marginTop = "5px";
  errorDiv.textContent = message;

  field.parentNode.appendChild(errorDiv);
  field.errorDiv = errorDiv;
}

function clearErrors() {
  const fields = document.querySelectorAll(".form-input");
  fields.forEach((field) => {
    field.style.borderColor = "";
    if (field.errorDiv) {
      field.errorDiv.remove();
      field.errorDiv = null;
    }
  });
}

function saveBooking() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const booking = {
    id: "booking_" + Date.now(),
    userId: user.id,
    firstName: document.getElementById("first-name").value,
    lastName: document.getElementById("last-name").value,
    email: document.getElementById("email").value,
    destination: currentBooking.destination,
    passengers: currentBooking.passengers,
    totalPrice: currentBooking.totalPrice,
    departureDate: document.getElementById("departure-date").value,
    bookingDate: new Date().toLocaleDateString(),
  };

  const existingBookings = JSON.parse(
    localStorage.getItem("spaceBookings") || "[]"
  );

  existingBookings.push(booking);

  localStorage.setItem("spaceBookings", JSON.stringify(existingBookings));

  showSuccessMessage(booking.id);
}

function showSuccessMessage(bookingId) {
  const successHTML = `
    <div class="text-center p-8">
      <div class="bg-green-500/20 border border-green-500 rounded-lg p-6 inline-block">
        <i class="fas fa-check-circle text-green-400 text-4xl mb-3"></i>
        <h3 class="font-orbitron text-xl text-green-400 mb-2">Booking Saved!</h3>
        <p class="text-gray-300 mb-2">Your space journey is confirmed!</p>
        <p class="text-sm text-gray-400 mb-4">ID: ${bookingId}</p>
        <button onclick="goHome()" class="btn-primary px-6 py-2">
          Back to Booking
        </button>
      </div>
    </div>
  `;

  const form = document.querySelector("form");
  form.innerHTML = successHTML;
}

function goHome() {
  window.location.href = "bookings.html";
}
