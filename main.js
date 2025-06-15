// ===== Header Scroll & Menu =====
let header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('shadow', window.scrollY > 0);
});

let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
menu.onclick = () => {
  menu.classList.toggle('bx-x');
  navbar.classList.toggle('active');
};
window.onscroll = () => {
  menu.classList.remove('bx-x');
  navbar.classList.remove('active');
};

// ===== API Constants =====
const apiKey = 'b0e0abfaa92cc20c336cd4ffe0eb4a58';
const imageBase = 'https://image.tmdb.org/t/p/';

// ===== Hero Slider (Now Playing) =====
const sliderWrapper = document.querySelector('#home .swiper-wrapper');
fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`)
  .then(res => res.json())
  .then(data => {
    data.results.slice(0, 5).forEach(movie => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide container';
      slide.innerHTML = `
        <a href="movie.html?id=${movie.id}">
          <img src="${imageBase}original${movie.backdrop_path}" alt="${movie.title}" />
          <div class="home-text">
            <span>Now Playing</span>
            <h1>${movie.title}</h1>
            <div class="btn">Watch Now</div>
            <div class="play"><i class='bx bx-play'></i></div>
          </div>
        </a>
      `;
      sliderWrapper.appendChild(slide);
    });

    new Swiper(".home", {
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      pagination: { el: ".swiper-pagination", clickable: true },
      loop: true
    });
  })
  .catch(err => console.error('Slider error:', err));

// ===== Movie Grid with Load More =====
const movieContainer = document.getElementById('movieContainer');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const movieHeading = document.getElementById('movieSectionHeading');
let currentPage = 1;
const maxPages = 5;

const searchInfo = document.createElement('div');
searchInfo.className = 'search-info';
movieContainer.before(searchInfo);

function loadMovies(page = 1, reset = false) {
  if (reset) {
    movieContainer.innerHTML = '';
    currentPage = 1;
    searchInfo.innerText = '';
    loadMoreBtn.style.display = 'inline-block';
    movieHeading.style.display = 'block';
  }

  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`)
    .then(res => res.json())
    .then(data => {
      data.results.forEach(movie => {
        const movieBox = document.createElement('a');
        movieBox.href = `movie.html?id=${movie.id}`;
        movieBox.classList.add('box');
        movieBox.innerHTML = `
          <div class="box-img">
            <img src="${imageBase}w500${movie.poster_path}" alt="${movie.title}" />
          </div>
          <h3>${movie.title}</h3>
          <span>${movie.release_date} | Rating: ${movie.vote_average}</span>
        `;
        movieContainer.appendChild(movieBox);
      });

      if (currentPage >= data.total_pages || currentPage >= maxPages) {
        loadMoreBtn.style.display = 'none';
      }
    })
    .catch(err => console.error('Popular movies error:', err));
}
loadMovies(currentPage);

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  loadMovies(currentPage);
});

// ===== Coming Soon Slider =====
const comingWrapper = document.getElementById('comingWrapper');
fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`)
  .then(res => res.json())
  .then(data => {
    data.results.slice(0, 10).forEach(movie => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide box';
      slide.innerHTML = `
        <div class="box-img">
          <img src="${imageBase}w500${movie.poster_path}" alt="${movie.title}" />
        </div>
        <h3>${movie.title}</h3>
        <span>${movie.release_date}</span>
      `;
      comingWrapper.appendChild(slide);
    });

    new Swiper(".coming-container", {
      spaceBetween: 20,
      loop: true,
      centeredSlides: true,
      autoplay: { delay: 2500, disableOnInteraction: false },
      breakpoints: {
        320: { slidesPerView: 2 },
        568: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 }
      }
    });
  })
  .catch(err => console.error('Upcoming error:', err));

// ===== Search Movies =====
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const query = searchInput.value.trim();
  document.getElementById("movies").scrollIntoView({ behavior: "smooth" });
  if (query) searchMovies(query);
  else loadMovies(1, true);
});

function searchMovies(query) {
  movieContainer.innerHTML = '<p>Searching...</p>';
  loadMoreBtn.style.display = 'none';
  searchInfo.innerText = `Showing results for: "${query}"`;
  movieHeading.style.display = 'none';

  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US`)
    .then(res => res.json())
    .then(data => {
      movieContainer.innerHTML = '';
      if (!data.results.length) {
        movieContainer.innerHTML = '<p>No results found.</p>';
        return;
      }

      data.results.forEach(movie => {
        const movieBox = document.createElement('a');
        movieBox.href = `movie.html?id=${movie.id}`;
        movieBox.classList.add('box');
        movieBox.innerHTML = `
          <div class="box-img">
            <img src="${imageBase}w500${movie.poster_path}" alt="${movie.title}" />
          </div>
          <h3>${movie.title}</h3>
          <span>${movie.release_date} | Rating: ${movie.vote_average}</span>
        `;
        movieContainer.appendChild(movieBox);
      });
    })
    .catch(err => {
      movieContainer.innerHTML = '<p>Failed to fetch results.</p>';
      console.error('Search error:', err);
    });
}

// ===== Scroll Spy =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');
window.addEventListener('scroll', () => {
  let scrollY = window.pageYOffset;
  sections.forEach(sec => {
    let top = sec.offsetTop - 100;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('home-active');
        if (link.getAttribute('href').includes(id)) {
          link.classList.add('home-active');
        }
      });
    }
  });
});

// ===== Sign In → Profile Icon =====
window.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const authBtn = document.getElementById('auth-button');

  if (user && authBtn && user.username) {
    const initial = user.username[0]?.toUpperCase() || "U";
    authBtn.innerHTML = `<div id="profile-icon">${initial}</div>`;
    authBtn.href = "profile.html";
  } else if (authBtn) {
    authBtn.textContent = "Sign In";
    authBtn.href = "signin.html";
  }
});

// ===== Poster Click Auth + Save Watch History =====
document.addEventListener('click', async function (e) {
  const poster = e.target.closest('a');
  if (!poster || !poster.href.includes('movie.html')) return;
  e.preventDefault();

  const movieId = new URL(poster.href).searchParams.get('id');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert("⚠️ Please sign in to continue.");
    localStorage.setItem('redirectAfterLogin', 'index.html');
    window.location.href = 'signin.html';
    return;
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
    const movie = await res.json();

    await fetch(`https://cinestream-v1sy.onrender.com/api/history/${user._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        releaseDate: movie.release_date
      })
    });
  } catch (err) {
    console.error("❌ Failed to save watch history:", err);
  }

  window.location.href = poster.href;
});
