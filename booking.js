"use strict";

document.addEventListener("DOMContentLoaded", function () {
  console.log("Booking page loaded!");
  loadDestinations();
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
          <p class="text-2xl font-orbitron text-neon-cyan mt-2">$${selectedDestination.price.toLocaleString()}</p>
        </div>
      </div>
      <p class="text-gray-300 mt-4 text-sm">${
        selectedDestination.shortDescription
      }</p>
    </div>
  `;

  packageSection.innerHTML = detailsHTML;
}
