const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

// 電影清單陣列
const movies = []

// 被搜尋過濾後的電影陣列
let filteredMovies = []

// 每頁要幾個電影數量
const MOVIES_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

// 渲染電影清單用函式，引數為陣列
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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

// 渲染分頁器用函式，引述為整數
function renderPaginator(amount) {
  const numbersOfPages = Math.ceil(amount / MOVIES_PER_PAGE)

  let rawHTML = ''
  for (let page = 1; page <= numbersOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// 製作modal用函式
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

// 增加最愛清單用函式
function addFavoriteMovie(id) {
  // 製作最愛電影清單陣列，初始無資料，會被設為空陣列
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  // 欲加入list陣列的物件(點到+號的電影)
  const movie = movies.find(movie => movie.id === id)

  // 重複加入的錯誤訊息
  if (list.some(movie => movie.id === id)) {
    return alert('此電影已被加入收藏清單!')
  }
  // 放入list陣列
  list.push(movie)
  // 放入瀏覽器暫存，並轉換為JSON
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 電影分頁用函式，會回傳不同頁面的電影清單陣列，引數為整數
function getMovieByPage(page) {
  const startIndex = (page - 1) * MOVIES_PER_PAGE

  let data = filteredMovies.length ? filteredMovies : movies
  // 回傳分好頁的新陣列
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

// 事件監聽(觸發Modal & 加入最愛)
dataPanel.addEventListener('click', function onPanelClick(event) {
  const target = event.target
  let id = Number(target.dataset.id)
  if (target.matches('.btn-show-movie')) {
    showMovieModal(id)
  } else if (target.matches('.btn-add-favorite')) {
    addFavoriteMovie(id)
  }
})

// 事件監聽(搜尋用)
searchForm.addEventListener('submit', function onSearchForm(event) {
  // 首先避免瀏覽器預設行為
  event.preventDefault()
  // 取得input值，利用trim()過濾空白字元，並一律轉為小寫
  const keyword = searchInput.value.trim().toLowerCase()

  // if (!keyword) {
  //   return alert('Please input valid value!')
  // }

  // 將符合條件者放入filterMovies陣列，過濾條件都轉為小寫
  filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))
  // 關鍵字沒有符合條件時給予錯誤訊息
  if (filteredMovies.length === 0) {
    return alert('cannot find movie keywords: ' + keyword)
  }
  // for(const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovie.push(movie)
  //   }
  // }

  // 渲染結果
  renderPaginator(filteredMovies.length)
  renderMovieList(getMovieByPage(1))

})

// 跳分頁監聽(瀏覽用)
paginator.addEventListener('click', function onPagintorClicked(event) {
  const target = event.target
  // 判斷點擊標籤是否為<a>
  if (target.tagName !== 'A') return

  const page = Number(target.dataset.page)
  //更新畫面
  renderMovieList(getMovieByPage(page))
})

// 初始渲染並呼叫API用函式
function getMovieList() {
  axios
    .get(INDEX_URL)
    .then((res) => {
      movies.push(...res.data.results)
      // 渲染出分頁條
      renderPaginator(movies.length)
      // 預設顯示第1頁
      renderMovieList(getMovieByPage(1))
    })
    .catch((err) => {
      console.log(err)
    })
}

// 初始渲染呼叫
getMovieList()