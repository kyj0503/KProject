let selectedPlaceId = null;

function showReviewForm(placeId) {
    selectedPlaceId = placeId;

    fetch(`/reviews/form?placeId=${placeId}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('review-form-container').innerHTML = html;
            document.getElementById('review-form').style.display = 'block';
        })
        .catch(error => console.error('폼 로드 오류:', error));
}

function submitReview() {
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;

    fetch('/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId: selectedPlaceId, rating, comment })
    })
        .then(response => response.json())
        .then(() => {
            alert('리뷰가 저장되었습니다!');
            document.getElementById('review-form').style.display = 'none';
            loadReviews(selectedPlaceId);
        })
        .catch(error => console.error('리뷰 저장 오류:', error));
}

function loadReviews(placeId) {
    fetch(`/reviews/sorted/${placeId}`)
        .then(response => response.json())
        .then(reviews => {
            const reviewList = document.getElementById('review-list');
            reviewList.innerHTML = '';
            reviews.forEach(review => {
                const li = document.createElement('li');
                li.textContent = `별점: ${review.rating}, 코멘트: ${review.comment}`;
                reviewList.appendChild(li);
            });
        })
        .catch(error => console.error('리뷰 로드 오류:', error));
}
