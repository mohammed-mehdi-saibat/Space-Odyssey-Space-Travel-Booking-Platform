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

  // Accommodation selection with visual feedback
  const accommodationOptions = document.querySelectorAll(
    ".accommodation-option"
  );
  accommodationOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      document.querySelectorAll(".accommodation-option").forEach((opt) => {
        opt.classList.remove("selected");
      });

      // Add selected class to clicked option
      this.classList.add("selected");

      // Find the radio input and trigger change
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        currentBooking.accommodation = radio.value;
        calculateTotalPrice();
      }
    });
  });

  // Set initial accommodation
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
