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
    <div style="text-align: center; padding: 20px;">
      <div style="background: rgba(34, 197, 94, 0.2); border: 1px solid green; border-radius: 10px; padding: 20px; display: inline-block;">
        <div style="color: green; font-size: 40px; margin-bottom: 10px;">✓</div>
        <h3 style="color: green; margin-bottom: 10px;">Booking Confirmed!</h3>
        <p style="color: white; margin-bottom: 10px;">Your space journey is booked!</p>
        <p style="color: lightgray; font-size: 14px; margin-bottom: 15px;">ID: ${bookingId}</p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button onclick="goHome()" style="background: #0ea5e9; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
            My Bookings
          </button>
          <button onclick="showTicketModal('${bookingId}')" style="background: transparent; border: 1px solid #0ea5e9; color: #0ea5e9; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
            View Ticket
          </button>
        </div>
      </div>
    </div>
  `;

  const form = document.querySelector("form");
  form.innerHTML = successHTML;
}

function goHome() {
  window.location.href = "bookings.html";
}

function showTicketModal(bookingId) {
  const bookings = JSON.parse(localStorage.getItem("spaceBookings") || "[]");
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    alert("Ticket not found!");
    return;
  }

  const modalHTML = `
        <div id="ticketModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div style="background: white; padding: 20px; border-radius: 10px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                    <h2 style="margin: 0; color: black; font-family: Orbitron;">SpaceVoyager Ticket</h2>
                    <button onclick="closeTicketModal()" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
                </div>
                
                <!-- Ticket Content -->
                <div style="color: black;">
                    <!-- Passenger Info -->
                    <div style="margin-bottom: 15px;">
                        <h3 style="color: #0ea5e9; margin-bottom: 10px;">Passenger</h3>
                        <p><strong>Name:</strong> ${booking.firstName} ${
    booking.lastName
  }</p>
                        <p><strong>Email:</strong> ${booking.email}</p>
                        <p><strong>Passengers:</strong> ${
                          booking.passengers
                        }</p>
                    </div>
                    
                    <!-- Journey Info -->
                    <div style="margin-bottom: 15px;">
                        <h3 style="color: #0ea5e9; margin-bottom: 10px;">Journey</h3>
                        <p><strong>Destination:</strong> ${getDestName(
                          booking.destination
                        )}</p>
                        <p><strong>Departure:</strong> ${
                          booking.departureDate
                        }</p>
                        <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">CONFIRMED</span></p>
                    </div>
                    
                    <!-- Price -->
                    <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                        <p style="margin: 0;"><strong>Total Price:</strong> $${booking.totalPrice.toLocaleString()}</p>
                        <p style="margin: 0;"><strong>Booking ID:</strong> ${
                          booking.id
                        }</p>
                    </div>
                    
                    <!-- Print Button -->
                    <button onclick="printThisTicket()" style="background: #0ea5e9; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%;">
                        Print Ticket
                    </button>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function getDestName(destId) {
  const names = {
    moon: "The Moon",
    mars: "Mars",
    europa: "Europa",
    titan: "Titan",
    "orbital-station": "Orbital Station",
    "venus-clouds": "Venus Cloud Cities",
  };
  return names[destId] || destId;
}

function closeTicketModal() {
  const modal = document.getElementById("ticketModal");
  if (modal) modal.remove();
}

function printThisTicket() {
  window.print();
}
