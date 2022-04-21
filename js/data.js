/* exported data */
var data = {
  films: [],
  view: 'list-page',
  reviews: [],
  nextReviewId: 1,
  editing: null
};

var previousData = localStorage.getItem('current-movies');
if (previousData !== null) {
  data = JSON.parse(previousData);
}

window.addEventListener('beforeunload', function (event) {
  var reviewsJSON = JSON.stringify(data);
  localStorage.setItem('current-movies', reviewsJSON);
});
