const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const container = document.getElementById('favoritesContainer');
const emptyMessage = document.getElementById('emptyMessage');

function renderFavorites() {
  container.innerHTML = "";
  if (favorites.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }
  emptyMessage.style.display = 'none';

  favorites.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <button class="remove-btn" onclick="removeFavorite(${index})">Remove</button>
      <img src="${item.image || 'https://via.placeholder.com/300'}" alt="${item.title}" style="width:100%; height:180px; object-fit:cover;">
      <div class="mall-info">
        <h2>${item.title}</h2>
        <p>Added to your favourites.</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function removeFavorite(index) {
  favorites.splice(index, 1);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

renderFavorites();
