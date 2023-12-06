const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

// 取得存在瀏覽器暫存中的電影清單，並將JSON轉為物件
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const dataPanel = document.querySelector('#data-panel')

// 渲染電影清單用函式
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer text-muted">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id=${item.id}>more</button>
              <button class="btn btn-danger btn-remove-favorite" data-id=${item.id}>X</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const movieModalTitle = document.querySelector('#movie-modal-title')
  const movieModalImage = document.querySelector('#movie-modal-image')
  const movieModalDate = document.querySelector('#movie-modal-date')
  const movieModalDescription = document.querySelector('#movie-modal-description')

  axios
    .get(INDEX_URL + id)
    .then(res => {
      const result = res.data.results
      console.log(result.title)
      movieModalTitle.innerText = result.title
      movieModalImage.innerHTML = `<img src="${POSTER_URL + result.image}" alt="" class="image-fluid">`
      movieModalDate.innerText = `Releass ${result.release_date}`
      movieModalDescription.innerText = result.description
    })
}

function removeFavoriteMovie(id) {
  // if movies has nothing then return
  if (!movies || !movies.length) return
  // Find id of remove target
  const movieIndex = movies.findIndex(movie => movie.id === id)
  // if there is no id then return
  if (movieIndex === -1) return
  // delete from favorite movies list
  movies.splice(movieIndex, 1)
  // put back to favoriteMovies in local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  // refresh
  renderMovieList(movies)
}

dataPanel.addEventListener('click', function onPanelClick(event) {
  const target = event.target
  let id = Number(target.dataset.id)
  if (target.matches('.btn-show-movie')) {
    showMovieModal(id)
  } else if (target.matches('.btn-remove-favorite')) {
    removeFavoriteMovie(id)
  }
})

renderMovieList(movies)