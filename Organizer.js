    const form = document.getElementById('eventForm');
    const eventsList = document.getElementById('eventsList');
    const widget = document.getElementById('eventWidget');
    const searchInput = document.getElementById('searchInput');
    const imageInput = document.getElementById('eventImage');
    const imagePreview = document.getElementById('imagePreview');

    let editingEventId = null;

    window.addEventListener('DOMContentLoaded', () => {
      const saved = JSON.parse(localStorage.getItem('events')) || [];
      saved.forEach(event => displayEvent(event));
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const eventName = document.getElementById('eventName').value.trim();
      const location = document.getElementById('eventLocation').value.trim();
      const description = document.getElementById('eventDescription').value.trim();
      const startTime = document.getElementById('startTime').value;
      const endTime = document.getElementById('endTime').value;
      const imageFile = document.getElementById('eventImage').files[0];

      if (new Date(endTime) <= new Date(startTime)) {
        alert("End time must be after start time.");
        return;
      }

      const saveData = (imageSrc) => {
        const newEvent = {
          id: editingEventId || Date.now(),
          eventName,
          location,
          description,
          startTime,
          endTime,
          imageSrc
        };

        // Remove old if editing
        if (editingEventId) {
          const existing = JSON.parse(localStorage.getItem('events')) || [];
          const updated = existing.filter(ev => ev.id !== editingEventId);
          updated.push(newEvent);
          localStorage.setItem('events', JSON.stringify(updated));
          editingEventId = null;
        } else {
          const existing = JSON.parse(localStorage.getItem('events')) || [];
          existing.push(newEvent);
          localStorage.setItem('events', JSON.stringify(existing));
        }

        form.reset();
        imagePreview.style.display = 'none';
        refreshEvents();
      };

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          saveData(e.target.result);
        };
        reader.readAsDataURL(imageFile);
      } else if (imagePreview.src && imagePreview.style.display !== 'none') {
        saveData(imagePreview.src);
      } else {
        alert("Please select an image.");
      }
    });

    function displayEvent(event) {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.dataset.id = event.id;
      card.innerHTML = `
        <h3>${event.eventName}</h3>
        <img src="${event.imageSrc}" class="event-image" alt="Event Image" />
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Description:</strong> ${event.description}</p>
        <p><strong>Starts:</strong> ${new Date(event.startTime).toLocaleString()}</p>
        <p><strong>Ends:</strong> ${new Date(event.endTime).toLocaleString()}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;

      card.querySelector('.delete-btn').addEventListener('click', () => {
        const id = event.id;
        const stored = JSON.parse(localStorage.getItem('events')) || [];
        const updated = stored.filter(ev => ev.id !== id);
        localStorage.setItem('events', JSON.stringify(updated));
        refreshEvents();
      });

      card.querySelector('.edit-btn').addEventListener('click', () => {
        document.getElementById('eventName').value = event.eventName;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('startTime').value = event.startTime;
        document.getElementById('endTime').value = event.endTime;
        imagePreview.src = event.imageSrc;
        imagePreview.style.display = 'block';
        editingEventId = event.id;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      eventsList.prepend(card);
    }

    function refreshEvents() {
      eventsList.innerHTML = '';
      const saved = JSON.parse(localStorage.getItem('events')) || [];
      saved.forEach(event => displayEvent(event));
      updateWidget();
    }

    function updateWidget() {
      widget.innerHTML = '';
      const cards = eventsList.querySelectorAll('.event-card');
      [...cards].reverse().forEach(card => {
        const name = card.querySelector('h3').textContent;
        const div = document.createElement('div');
        div.className = 'widget-event';
        div.textContent = name;
        widget.appendChild(div);
      });
    }

    imageInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.src = e.target.result;
          imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.style.display = 'none';
      }
    });

    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      const cards = eventsList.querySelectorAll('.event-card');
      cards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = name.includes(query) ? '' : 'none';
      });
    });