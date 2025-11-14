"use strict";

document.addEventListener("DOMContentLoaded", function () {
  loadMyBookings();
});

function loadMyBookings() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const allBookings = JSON.parse(localStorage.getItem("spaceBookings") || "[]");

  const myBookings = allBookings.filter(
    (booking) => booking.userId === currentUser.id
  );

  displayBookings(myBookings);
}

function displayBookings(bookings) {
  const container = document.getElementById("bookings-list");

  if (bookings.length === 0) {
    container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-compass text-4xl text-gray-500 mb-4"></i>
                <h3 class="font-orbitron text-xl text-gray-400 mb-2">No Bookings Yet</h3>
                <p class="text-gray-500 mb-6">Start your space adventure by booking a journey!</p>
                <a href="booking.html" class="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-3 rounded-lg font-bold">
                    Book Your First Journey
                </a>
            </div>
        `;
    return;
  }

  let bookingsHTML = "";

  bookings.forEach((booking) => {
    const destinationName = getDestinationName(booking.destination);

    bookingsHTML += `
            <div class="bg-space-purple/50 p-6 rounded-lg mb-6 border border-neon-blue/30">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="font-orbitron text-xl text-neon-cyan mb-2">${destinationName}</h3>
                        <p class="text-gray-400 text-sm">Booking ID: ${
                          booking.id
                        }</p>
                    </div>
                    <span class="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                        Confirmed
                    </span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-gray-400 text-sm">Traveler</p>
                        <p class="text-white">${booking.firstName} ${
      booking.lastName
    }</p>
                    </div>
                    <div>
                        <p class="text-gray-400 text-sm">Departure Date</p>
                        <p class="text-white">${booking.departureDate}</p>
                    </div>
                    <div>
                        <p class="text-gray-400 text-sm">Passengers</p>
                        <p class="text-white">${booking.passengers}</p>
                    </div>
                    <div>
                        <p class="text-gray-400 text-sm">Booked On</p>
                        <p class="text-white">${booking.bookingDate}</p>
                    </div>
                </div>
                
                <div class="flex justify-between items-center">
                    <p class="text-2xl font-orbitron text-neon-cyan">$${booking.totalPrice.toLocaleString()}</p>
                    <button onclick="viewTicket('${
                      booking.id
                    }')" class="border border-neon-blue text-neon-blue px-4 py-2 rounded-lg hover:bg-neon-blue/10 transition-colors">
                        <i class="fas fa-ticket-alt mr-2"></i>View Ticket
                    </button>
                </div>
            </div>
        `;
  });

  container.innerHTML = bookingsHTML;
}

function getDestinationName(destinationId) {
  const destinations = {
    moon: "The Moon",
    mars: "Mars",
    europa: "Europa",
    titan: "Titan",
    "orbital-station": "Orbital Station",
    "venus-clouds": "Venus Cloud Cities",
  };
  return destinations[destinationId] || destinationId;
}

function viewTicket(bookingId) {
  alert("Printable ticket feature coming soon! Booking ID: " + bookingId);
}

function viewTicket(bookingId) {
  const bookings = JSON.parse(localStorage.getItem("spaceBookings") || "[]");
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    alert("Ticket not found!");
    return;
  }

  const modalHTML = `
        <div id="ticketModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div style="background: white; padding: 20px; border-radius: 10px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                    <h2 style="margin: 0; color: black; font-family: Orbitron;">SpaceVoyager Ticket</h2>
                    <button onclick="closeTicketModal()" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
                </div>
                
                <div style="color: black;">
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
                    
                    <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                        <p style="margin: 0;"><strong>Total Price:</strong> $${booking.totalPrice.toLocaleString()}</p>
                        <p style="margin: 0;"><strong>Booking ID:</strong> ${
                          booking.id
                        }</p>
                    </div>
                    
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
