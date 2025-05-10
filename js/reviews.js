let selectedRating = 0;

// При загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  const savedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
  const reviewsList = document.getElementById('reviews-list');

  savedReviews.forEach(review => {
    const div = document.createElement('div');
    div.className = 'review-item';
    div.innerHTML = `
      <h3>${review.name}</h3>
      <p>${review.text}</p>
      <div class="stars">${'⭐'.repeat(review.rating)}</div>
    `;
    reviewsList.appendChild(div);
  });

  // Выбор оценки
  const stars = document.querySelectorAll('.star-rating span');
  stars.forEach(star => {
    star.addEventListener('click', function() {
      selectedRating = parseInt(this.getAttribute('data-value'));
      stars.forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');
      this.nextElementSibling?.classList.remove('selected');
      if (this.previousElementSibling) {
        let prev = this;
        while (prev) {
          prev.classList.add('selected');
          prev = prev.previousElementSibling;
        }
      }
    });
  });
});

// Добавление нового отзыва
function addReview() {
  const username = localStorage.getItem('username') || 'Аноним';
  const text = document.getElementById('review-text').value.trim();

  if (text && selectedRating > 0) {
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';
    reviewItem.innerHTML = `
      <h3>${username}</h3>
      <p>${text}</p>
      <div class="stars">${'⭐'.repeat(selectedRating)}</div>
    `;

    document.getElementById('reviews-list').appendChild(reviewItem);

    // Сохранение в localStorage
    const savedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    savedReviews.push({ name: username, text: text, rating: selectedRating });
    localStorage.setItem('reviews', JSON.stringify(savedReviews));

    // Очистка формы
    document.getElementById('review-text').value = '';
    selectedRating = 0;
    const stars = document.querySelectorAll('.star-rating span');
    stars.forEach(s => s.classList.remove('selected'));
  }
}
