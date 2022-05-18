const $movieList = document.querySelector('#movie-list');
const $infoPage = document.querySelector('#info-page');
const $movieInfo = document.querySelector('#movie-info');
const $reviewPage = document.querySelector('#review-page');
const noReviews = document.querySelector('#no-reviews');
const newReview = document.querySelector('#new-review');
const $addReviewButton = document.querySelector('#add-review-btn');
const $reviewsTab = document.querySelector('#reviews-tab');
const $reviewList = document.querySelector('#review-list');
const $form = document.querySelector('form');
const $ulElement = document.querySelector('ul');
const newReviewList = document.querySelector('#new-review-list');
const $deleteButton = document.querySelector('#review-delete');
const $goBackbtn = document.querySelector('#back-btn');
const $modal = document.querySelector('#modal');
const $noButton = document.querySelector('.no-btn');
const $yesButton = document.querySelector('.yes-btn');
const $moviesTab = document.querySelector('#movies-tab');
const reviewMovieTitle = document.querySelector('#review-movie');
const reviewImage = document.querySelector('#review-image');
const reviewItems = document.querySelectorAll('#review-list-item');
const loadingSpinner = document.querySelector('.lds-facebook');

loadingSpinner.className = 'lds-facebook';
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://imdb-api.com/API/InTheaters/k_ke6b7now');
xhr.responseType = 'json';
xhr.addEventListener('load', function () {

  loadingSpinner.className = 'lds-facebook hidden';

  data.films = xhr.response.items;

  for (let i = 0; i < data.films.length; i++) {
    const $imgElement = document.createElement('img');
    $imgElement.setAttribute('src', xhr.response.items[i].image);
    $imgElement.setAttribute('movie-index', i);
    $imgElement.setAttribute('id', 'movie-poster');
    $movieList.appendChild($imgElement);
    $movieList.addEventListener('click', handlePosterClick);
    $addReviewButton.addEventListener('click', handleReviewButton);
  }
  newReview.className = 'hidden';
  $reviewList.className = 'hidden';
  noReviews.className = 'text-center hidden';
});

xhr.send();

function handlePosterClick(event) {
  if (event.target.tagName === 'IMG') {
    $movieList.className = 'hidden';
    $infoPage.className = '';
    $reviewPage.className = 'hidden';
    const index = event.target.getAttribute('movie-index');
    const movieInfoDom = createMovieInfo(xhr.response.items[index]);
    $movieInfo.appendChild(movieInfoDom);
  }
}

function createMovieInfo(movie) {
  for (let i = 0; i < xhr.response.items.length; i++) {
    var $movieInfoBox = document.createElement('div');
    const titleElement = document.createElement('h2');
    titleElement.setAttribute('id', 'movie-title');
    titleElement.textContent = movie.title;
    $movieInfoBox.appendChild(titleElement);

    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', movie.image);
    imgElement.setAttribute('id', 'movie-banner');
    $movieInfoBox.appendChild(imgElement);

    const pElement = document.createElement('p');
    pElement.textContent = movie.plot;
    $movieInfoBox.appendChild(pElement);

    const infoBox = document.createElement('div');
    infoBox.setAttribute('class', 'info-box');
    $movieInfoBox.appendChild(infoBox);

    const ulElement = document.createElement('ul');
    infoBox.appendChild(ulElement);

    const liElement1 = document.createElement('li');
    liElement1.textContent = 'Director: ' + movie.directors;
    ulElement.appendChild(liElement1);

    const liElement2 = document.createElement('li');
    liElement2.textContent = 'Cast: ' + movie.stars;
    ulElement.appendChild(liElement2);

    const liElement3 = document.createElement('li');
    liElement3.textContent = 'Genres: ' + movie.genres;
    ulElement.appendChild(liElement3);

    const liElement4 = document.createElement('li');
    liElement4.textContent = 'Content Rating: ' + movie.contentRating;
    ulElement.appendChild(liElement4);

    const liElement5 = document.createElement('li');
    liElement5.textContent = 'Running Time: ' + movie.runtimeStr;
    ulElement.appendChild(liElement5);
  }
  return $movieInfoBox;
}

// remove child

function removeChild(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

$goBackbtn.addEventListener('click', goBack);

function goBack(event) {
  $infoPage.className = 'hidden';
  $movieList.className = '';
  $reviewPage.className = 'hidden';
  if (event.target) {
    removeChild($movieInfo);
  }
}

// Movies Tab

$moviesTab.addEventListener('click', function (event) {
  $movieList.className = '';
  $infoPage.className = 'hidden';
  $reviewPage.className = 'hidden';
  if (event.target) {
    removeChild($movieInfo);
  }
});

// Reviews Tab

$reviewsTab.addEventListener('click', clickReview);

function clickReview(event) {
  $movieList.className = 'hidden';
  $infoPage.className = 'hidden';

  if (data.reviews.length === 0) {
    noReviews.className = 'text-center';
    newReview.className = 'hidden';
    $reviewPage.className = '';
    $reviewList.className = 'hidden';
  } else {
    noReviews.className = 'text-center hidden';
    $reviewPage.className = '';
    newReview.className = 'hidden';
    $reviewList.className = '';
    data.view = 'review-list';
  }
  if (event.target) {
    removeChild($movieInfo);
  }
}

function handleReviewButton(event) {
  $reviewPage.className = '';
  noReviews.classList.add('hidden');
  newReview.className = '';
  $movieList.className = 'hidden';
  $infoPage.className = 'hidden';
  $reviewList.className = 'hidden';

  $deleteButton.className = 'not-visible';

  reviewMovieTitle.textContent = document.querySelector('#movie-title').textContent;
  reviewImage.setAttribute('src', document.querySelector('#movie-banner').src);
}

// submit review

$form.addEventListener('submit', submitReview);

function submitReview(event) {
  event.preventDefault();
  let review = {};
  if (data.editing === null) {
    review = {
      title: document.querySelector('#movie-title').textContent,
      image: document.querySelector('#movie-banner').src,
      text: $form.elements[0].value,
      reviewId: data.nextReviewId
    };

    // add new review to data

    data.nextReviewId++;
    data.reviews.unshift(review);
    $ulElement.prepend(createReviewListItem(review));
    $form.reset();

  } else if (data.editing !== null) {
    review.title = document.querySelector('#movie-title').textContent;
    review.image = document.querySelector('#movie-banner').src;
    review.text = $form.elements[0].value;
    review.reviewId = data.editing.reviewId;

    // push edited reviews to review list

    for (let i = 0; i < data.reviews.length; i++) {
      if (data.reviews[i].reviewId === review.reviewId) {
        data.reviews[i] = review;
      }
    }

    // replace dom

    for (let z = 0; z < reviewItems.length; z++) {
      const reviewItemID = JSON.parse(reviewItems[z].getAttribute('data-review-id'));
      if (reviewItemID === data.editing.reviewId) {
        reviewItems[z].replaceWith(createReviewListItem(review));
      }
    }
    data.editing = null;
    $form.reset();
  }

  $movieList.className = 'hidden';
  $infoPage.className = 'hidden';
  noReviews.className = 'text-center hidden';
  newReview.className = 'hidden';
  $reviewPage.className = '';
  $reviewList.className = '';
  data.view = 'review-list';
}

function createReviewListItem(review) {
  const liElement = document.createElement('li');
  liElement.setAttribute('class', 'reviews-li');
  liElement.setAttribute('id', 'review-list-item');
  liElement.setAttribute('data-review-id', review.reviewId);

  const row = document.createElement('div');
  row.className = 'row';
  liElement.appendChild(row);

  const columnHalf = document.createElement('div');
  columnHalf.className = 'column-half';
  row.appendChild(columnHalf);

  const imageElement = document.createElement('img');
  imageElement.setAttribute('id', 'movie-banner');
  imageElement.setAttribute('src', review.image);
  columnHalf.appendChild(imageElement);

  const reviewsText = document.createElement('div');
  reviewsText.className = 'column-half';
  row.appendChild(reviewsText);

  const titleElement = document.createElement('h4');
  titleElement.setAttribute('id', 'movie-title');
  titleElement.textContent = review.title;
  reviewsText.appendChild(titleElement);

  const spanElement = document.createElement('span');
  spanElement.setAttribute('class', 'edit-span');
  liElement.appendChild(spanElement);

  const editButton = document.createElement('button');
  editButton.setAttribute('id', 'edit-btn');
  editButton.textContent = 'Edit';
  spanElement.appendChild(editButton);

  const pElement = document.createElement('p');
  pElement.setAttribute('class', 'review-list-p');
  pElement.textContent = review.text;
  reviewsText.appendChild(pElement);

  const divElement = document.createElement('div');
  divElement.setAttribute('class', 'float-right');
  liElement.appendChild(divElement);

  return liElement;
}

// make reviews stay after refreshing

document.addEventListener('DOMContentLoaded', function (event) {
  for (let i = 0; i < data.reviews.length; i++) {
    const result = createReviewListItem(data.reviews[i]);
    newReviewList.appendChild(result);
  }
});

// edit reviews

newReviewList.addEventListener('click', handleEditBtn);

function handleEditBtn(event) {
  if (event.target.matches('#edit-btn')) {
    $deleteButton.className = '';
    const $liClosest = event.target.closest('li');
    let $reviewId = $liClosest.getAttribute('data-review-id');
    $reviewId = JSON.parse($reviewId);
    for (let i = 0; i < data.reviews.length; i++) {
      if (data.reviews[i].reviewId === $reviewId) {
        data.editing = data.reviews[i];
      }
    }
    document.querySelector('#review-movie').textContent = data.editing.title;
    document.querySelector('#review-image').src = data.editing.image;
    $form.elements[0].value = data.editing.text;

    $reviewPage.className = '';
    noReviews.classList.add('hidden');
    newReview.className = '';
    $movieList.className = 'hidden';
    $infoPage.className = 'hidden';
    $reviewList.className = 'hidden';
  }
}

// confirmation modal

$deleteButton.addEventListener('click', function (event) {
  $modal.className = 'gradient';
});

$noButton.addEventListener('click', function (event) {
  $modal.className = 'gradient hidden';
  $movieList.className = 'hidden';
  $infoPage.className = 'hidden';
  noReviews.className = 'text-center hidden';
  newReview.className = 'hidden';
  $reviewPage.className = '';
  $reviewList.className = '';
  data.view = 'review-list';
});

$yesButton.addEventListener('click', function (event) {
  for (let i = 0; i < data.reviews.length; i++) {
    if (data.reviews[i].reviewId === data.editing.reviewId) {
      data.reviews.splice(i, 1);
    }
    const reviewIdNum = parseInt(reviewItems[i].getAttribute('data-review-id'));
    if (reviewIdNum === data.editing.reviewId) {
      reviewItems[i].remove();
    }
  }
  data.editing = null;
  data.review = 'reviews-list';
  $modal.className = 'gradient hidden';
  $form.reset();
  clickReview(event);
});
