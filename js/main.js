var $movieList = document.querySelector('#movie-list');
var $infoPage = document.querySelector('#info-page');
var $movieInfo = document.querySelector('#movie-info');
var $reviewPage = document.querySelector('#review-page');
var noReviews = document.querySelector('#no-reviews');
var newReview = document.querySelector('#new-review');
var $addReviewButton = document.querySelector('#add-review-btn');
var $reviewsTab = document.querySelector('#reviews-tab');
var $reviewList = document.querySelector('#review-list');
var $form = document.querySelector('form');
var $ulElement = document.querySelector('ul');

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://imdb-api.com/API/InTheaters/k_ke6b7now');
xhr.responseType = 'json';
xhr.addEventListener('load', function () {

  data.films = xhr.response.items;

  for (var i = 0; i < data.films.length; i++) {
    var $imgElement = document.createElement('img');
    $imgElement.setAttribute('src', xhr.response.items[i].image);
    $imgElement.setAttribute('movie-index', i);
    $imgElement.setAttribute('id', 'movie-poster');
    $movieList.appendChild($imgElement);
    $movieList.addEventListener('click', handlePosterClick);
    $addReviewButton.addEventListener('click', handleReviewButton);
  }
});

xhr.send();

function handlePosterClick(event) {
  if (event.target.tagName === 'IMG') {
    $movieList.className = 'hidden';
    $infoPage.className = '';
    $reviewPage.className = 'hidden';
    var id = event.target.getAttribute('movie-index');
    var movieInfoDom = createMovieInfo(xhr.response.items[id]);
    $movieInfo.appendChild(movieInfoDom);
  }
}

function createMovieInfo(movie) {
  for (var i = 0; i < xhr.response.items.length; i++) {
    var $movieInfoBox = document.createElement('div');
    var titleElement = document.createElement('h2');
    titleElement.setAttribute('id', 'movie-title');
    titleElement.textContent = movie.title;
    $movieInfoBox.appendChild(titleElement);

    var imgElement = document.createElement('img');
    imgElement.setAttribute('src', movie.image);
    imgElement.setAttribute('id', 'movie-banner');
    $movieInfoBox.appendChild(imgElement);

    var pElement = document.createElement('p');
    pElement.textContent = movie.plot;
    $movieInfoBox.appendChild(pElement);

    var infoBox = document.createElement('div');
    infoBox.setAttribute('class', 'info-box');
    $movieInfoBox.appendChild(infoBox);

    var ulElement = document.createElement('ul');
    infoBox.appendChild(ulElement);

    var liElement1 = document.createElement('li');
    liElement1.textContent = 'Director: ' + movie.directors;
    ulElement.appendChild(liElement1);

    var liElement2 = document.createElement('li');
    liElement2.textContent = 'Cast: ' + movie.stars;
    ulElement.appendChild(liElement2);

    var liElement3 = document.createElement('li');
    liElement3.textContent = 'Genres: ' + movie.genres;
    ulElement.appendChild(liElement3);

    var liElement4 = document.createElement('li');
    liElement4.textContent = 'Content Rating: ' + movie.contentRating;
    ulElement.appendChild(liElement4);

    var liElement5 = document.createElement('li');
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

var $goBackbtn = document.querySelector('#back-btn');
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

var $moviesTab = document.querySelector('#movies-tab');
$moviesTab.addEventListener('click', function (event) {
  $movieList.className = '';
  $infoPage.className = 'hidden';
  $reviewPage.className = 'hidden';
  if (event.target) {
    removeChild($movieInfo);
  }
});

// Reviews Tab

$reviewsTab.addEventListener('click', function (event) {
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
});

function handleReviewButton(event) {
  $reviewPage.className = '';
  noReviews.classList.add('hidden');
  newReview.className = '';
  $movieList.className = 'hidden';
  $infoPage.className = 'hidden';
  $reviewList.className = 'hidden';

  var reviewMovieTitle = document.querySelector('#review-movie');
  var reviewImage = document.querySelector('#review-image');
  reviewMovieTitle.textContent = document.querySelector('#movie-title').textContent;
  reviewImage.setAttribute('src', document.querySelector('#movie-banner').src);
}

// submit review

$form.addEventListener('submit', submitReview);

function submitReview(event) {
  event.preventDefault();
  var review = {
    title: document.querySelector('#movie-title').textContent,
    image: document.querySelector('#movie-banner').src,
    text: $form.elements[0].value,
    reviewId: data.nextReviewId
  };
  data.nextReviewId++;
  data.reviews.unshift(review);
  $ulElement.prepend(createReviewListItem(review));
  $form.reset();

  $movieList.className = 'hidden';
  $infoPage.className = 'hidden';
  noReviews.className = 'text-center hidden';
  newReview.className = 'hidden';
  $reviewPage.className = '';
  $reviewList.className = '';
  data.view = 'review-list';
}

function createReviewListItem(review) {
  var liElement = document.createElement('li');
  liElement.setAttribute('class', 'reviews-li');
  liElement.setAttribute('data-review-id', review.reviewId);

  var row = document.createElement('div');
  row.className = 'row';
  liElement.appendChild(row);

  var columnHalf = document.createElement('div');
  columnHalf.className = 'column-half';
  row.appendChild(columnHalf);

  var imageElement = document.createElement('img');
  imageElement.setAttribute('id', 'movie-banner');
  imageElement.setAttribute('src', review.image);
  columnHalf.appendChild(imageElement);

  var reviewsText = document.createElement('div');
  reviewsText.className = 'column-half';
  row.appendChild(reviewsText);

  var titleElement = document.createElement('h4');
  titleElement.textContent = review.title;
  reviewsText.appendChild(titleElement);

  var pElement = document.createElement('p');
  pElement.setAttribute('class', 'review-list-p');
  pElement.textContent = review.text;
  reviewsText.appendChild(pElement);

  return liElement;
}

var newReviewList = document.querySelector('#new-review-list');

document.addEventListener('DOMContentLoaded', function (event) {
  for (var i = 0; i < data.reviews.length; i++) {
    var result = createReviewListItem(data.reviews[i]);
    newReviewList.appendChild(result);
  }
});
