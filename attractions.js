<script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    function toggleFavorite(icon) {
      const card = icon.closest('.card');
      const id = card.dataset.id;
      const title = card.dataset.title;
      const image = card.querySelector('img').src;

      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const index = favorites.findIndex(item => item.id === id);

      if (index === -1) {
        favorites.push({ id, title, image });
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid', 'favorited');
      } else {
        favorites.splice(index, 1);
        icon.classList.remove('fa-solid', 'favorited');
        icon.classList.add('fa-regular');
      }

      localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    window.addEventListener('DOMContentLoaded', () => {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      document.querySelectorAll('.card').forEach(card => {
        const id = card.dataset.id;
        const icon = card.querySelector('.favorite-icon');
        if (favorites.find(item => item.id === id)) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid', 'favorited');
        }
      });
    });