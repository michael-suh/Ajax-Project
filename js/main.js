var $movieList = document.querySelector('#movie-list');
var $infoPage = document.querySelector('#info-page');
var $movieInfo = document.querySelector('#movie-info');

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
  }
});

xhr.send();

function handlePosterClick(event) {
  if (event.target.tagName === 'IMG') {
    $movieList.className = 'hidden';
    $infoPage.className = '';
    var id = event.target.getAttribute('movie-index');
    var movieInfoDom = createMovieInfo(xhr.response.items[id]);
    $movieInfo.appendChild(movieInfoDom);
  }
}

function createMovieInfo(movie) {
  for (var i = 0; i < xhr.response.items.length; i++) {
    var $movieInfoBox = document.createElement('div');
    var titleElement = document.createElement('h2');
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
  if (event.target) {
    removeChild($movieInfo);
  }
}
