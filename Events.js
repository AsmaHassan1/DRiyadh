// ====== Favorites ======
    let selectedStars = 0;
    let currentEventCard = null;

    const modal = document.getElementById('reviewModal');
    const closeBtn = modal.querySelector('.close-btn');
    const stars = modal.querySelectorAll('.star');
    const userNameInput = document.getElementById('userName');
    const userReviewInput = document.getElementById('userReview');
    const submitReviewBtn = document.getElementById('submitReviewBtn');

    document.querySelectorAll('.review-button').forEach(button => {
      button.addEventListener('click', e => {
        currentEventCard = e.target.closest('.event-card');
        modal.style.display = 'block';
        resetModal();
        modal.setAttribute('aria-hidden', 'false');
      });
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    });

    window.addEventListener('click', e => {
      if (e.target === modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
    });

    stars.forEach((star, idx) => {
      star.addEventListener('click', () => {
        selectedStars = idx + 1;
        stars.forEach((s, i) => {
          s.classList.toggle('selected', i < selectedStars);
          s.setAttribute('aria-checked', i === idx ? 'true' : 'false');
          s.tabIndex = i === idx ? 0 : -1;
        });
      });
      star.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          star.click();
        }
      });
    });

    submitReviewBtn.addEventListener('click', () => {
      const name = userNameInput.value.trim();
      const review = userReviewInput.value.trim();

      if (!name || !review || selectedStars === 0) {
        alert('Please enter your name, review, and select a rating.');
        return;
      }

      const reviewSection = currentEventCard.querySelector('.userReviews');
      const newReview = document.createElement('div');
      newReview.classList.add('review');
      newReview.textContent = '⭐️'.repeat(selectedStars) + ` "${review}" - ${name}`;
      reviewSection.appendChild(newReview);

      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    });

    function resetModal() {
      userNameInput.value = '';
      userReviewInput.value = '';
      selectedStars = 0;
      stars.forEach(star => {
        star.classList.remove('selected');
        star.setAttribute('aria-checked', 'false');
        star.tabIndex = -1;
      });
      stars[0].tabIndex = 0;
    }

    // ====== Book ticket ======
   // ====== Book ticket ======
const bookingModal = document.getElementById('bookingModal');
const bookingCloseBtn = bookingModal.querySelector('.close-btn');
const bookNameInput = document.getElementById('bookName');
const bookEmailInput = document.getElementById('bookEmail');
const confirmBookingBtn = document.getElementById('confirmBookingBtn');
let currentBookingCard = null;

document.querySelectorAll('.book-button').forEach(button => {
  button.addEventListener('click', e => {
    currentBookingCard = e.target.closest('.event-card');
    bookingModal.style.display = 'block';
    bookNameInput.value = '';
    bookEmailInput.value = '';
    bookingModal.setAttribute('aria-hidden', 'false');
  });
});

bookingCloseBtn.addEventListener('click', () => {
  bookingModal.style.display = 'none';
  bookingModal.setAttribute('aria-hidden', 'true');
});

window.addEventListener('click', e => {
  if (e.target === bookingModal) {
    bookingModal.style.display = 'none';
    bookingModal.setAttribute('aria-hidden', 'true');
  }
});

confirmBookingBtn.addEventListener('click', () => {
  const name = bookNameInput.value.trim();
  const email = bookEmailInput.value.trim();

  // ✅ تحقق أن الاسم والإيميل مكتوبين
  if (!name || !email) {
    alert('Please fill in your name and email.');
    return;
  }

  // ✅ تحقق من صحة صيغة الإيميل
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // ✅ لو الإيميل صحيح، احفظ الحجز
  const eventId = currentBookingCard.getAttribute('data-event-id');
  const eventTitle = currentBookingCard.querySelector('h2').textContent;

  const booking = {
    eventId,
    eventTitle,
    name,
    email,
    timestamp: new Date().toISOString()
  };

  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));

  alert('Booking confirmed!');
  bookingModal.style.display = 'none';
  bookingModal.setAttribute('aria-hidden', 'true');
});


    

    bookingCloseBtn.addEventListener('click', () => {
      bookingModal.style.display = 'none';
      bookingModal.setAttribute('aria-hidden', 'true');
    });

    window.addEventListener('click', e => {
      if (e.target === bookingModal) {
        bookingModal.style.display = 'none';
        bookingModal.setAttribute('aria-hidden', 'true');
      }
    });

    confirmBookingBtn.addEventListener('click', () => {
      const name = bookNameInput.value.trim();
      const email = bookEmailInput.value.trim();

      if (!name) return;


     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) return;
      

      const eventId = currentBookingCard.getAttribute('data-event-id');
      const eventTitle = currentBookingCard.querySelector('h2').textContent;

      const booking = {
        eventId,
        eventTitle,
        name,
        email,
        timestamp: new Date().toISOString()
      };

      let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
      bookings.push(booking);
      localStorage.setItem('bookings', JSON.stringify(bookings));

      alert('Booking confirmed!');
      bookingModal.style.display = 'none';
      bookingModal.setAttribute('aria-hidden', 'true');
    });

    // ====== التحكم في المفضلة (Favorites) ======
    // مصفوفة بيانات الأحداث كاملة
    const allEvents = [
      {
        id: "1",
        title: "Eid Al Adha",
        image: "https://i.postimg.cc/bvyMc75V/eid.jpg",
      },
      {
        id: "2",
        title: "Visit the Zoo",
        image: "https://i.postimg.cc/15WjKvJh/zoo.jpg",
      }
    ];

    function toggleFavorite(icon) {
      const card = icon.closest('.event-card');
      const id = card.getAttribute('data-event-id');

      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const index = favorites.findIndex(item => item.id === id);

      if (index === -1) {
        // أضف كامل بيانات الحدث (ليس فقط id)
        const eventData = allEvents.find(e => e.id === id);
        if (eventData) {
          favorites.push(eventData);
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
        }
      } else {
        favorites.splice(index, 1);
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
      }

      localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    window.addEventListener('DOMContentLoaded', () => {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      document.querySelectorAll('.event-card').forEach(card => {
        const id = card.getAttribute('data-event-id');
        const icon = card.querySelector('.favorite-icon');
        if (favorites.find(item => item.id === id)) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
        } else {
          icon.classList.remove('fa-solid');
          icon.classList.add('fa-regular');
        }
      });
    });