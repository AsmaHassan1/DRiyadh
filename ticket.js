const currentContainer = document.getElementById("currentTickets");
const cancelledContainer = document.getElementById("cancelledTickets");

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
let cancelled = JSON.parse(localStorage.getItem("cancelledBookings")) || [];

function renderTickets() {
  currentContainer.innerHTML = '';
  cancelledContainer.innerHTML = '';

  // Current Bookings
  if (bookings.length === 0) {
    currentContainer.innerHTML = '<p class="empty">No current bookings.</p>';
  } else {
    bookings.forEach((ticket, index) => {
      const div = document.createElement('div');
      div.className = 'ticket';
      div.innerHTML = `
        <h2>${ticket.eventTitle}</h2>
        <p><strong>Name:</strong> ${ticket.name}</p>
        <p><strong>Email:</strong> ${ticket.email}</p>
        <p><strong>Date:</strong> ${new Date(ticket.timestamp).toLocaleString()}</p>
        <button class="cancel-button" data-index="${index}">Cancel Ticket</button>
      `;
      currentContainer.appendChild(div);
    });
  }

  // Cancelled Bookings
  if (cancelled.length === 0) {
    cancelledContainer.innerHTML = '<p class="empty">No cancelled tickets.</p>';
  } else {
    cancelled.forEach(ticket => {
      const div = document.createElement('div');
      div.className = 'ticket';
      div.innerHTML = `
        <h2>${ticket.eventTitle}</h2>
        <p><strong>Name:</strong> ${ticket.name}</p>
        <p><strong>Email:</strong> ${ticket.email}</p>
        <p><strong>Cancelled On:</strong> ${new Date(ticket.timestamp).toLocaleString()}</p>
      `;
      cancelledContainer.appendChild(div);
    });
  }
}

currentContainer.addEventListener('click', e => {
  if (e.target.classList.contains('cancel-button')) {
    const index = e.target.getAttribute('data-index');
    const cancelledTicket = bookings.splice(index, 1)[0];
    cancelledTicket.timestamp = new Date().toISOString(); // update timestamp for cancel
    cancelled.push(cancelledTicket);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('cancelledBookings', JSON.stringify(cancelled));
    renderTickets();
  }
});

renderTickets();
