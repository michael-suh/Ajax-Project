/* exported data */
let data = {
  films: [],
  view: 'list-page',
  reviews: [],
  nextReviewId: 1,
  editing: null
};

const previousData = localStorage.getItem('current-movies');
if (previousData !== null) {
  data = JSON.parse(previousData);
}

window.addEventListener('beforeunload', function (event) {
  const reviewsJSON = JSON.stringify(data);
  localStorage.setItem('current-movies', reviewsJSON);
});
