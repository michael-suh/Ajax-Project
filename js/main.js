var $movieList = document.querySelector('#movie-list');
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://imdb-api.com/API/InTheaters/k_ke6b7now');
xhr.responseType = 'json';
xhr.addEventListener('load', function () {
  for (var i = 0; i < xhr.response.items.length; i++) {
    var $imgElement = document.createElement('img');
    $imgElement.setAttribute('src', xhr.response.items[i].image);
    $movieList.appendChild($imgElement);
  }
});

xhr.send();
