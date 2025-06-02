const apiKey = 'b0e0abfaa92cc20c336cd4ffe0eb4a58';
const imageBase = 'https://image.tmdb.org/t/p/';
const movieId = new URLSearchParams(window.location.search).get("id");

// Get DOM elements
const iframe = document.getElementById('movie-frame');
const titleEl = document.getElementById('movieTitle');
const overviewEl = document.getElementById('movieOverview');
const dateEl = document.getElementById('movieDate');
const ratingEl = document.getElementById('movieRating');
const castEl = document.getElementById('movieCast');
const recommendedContainer = document.getElementById('recommendedMovies');

// Load and display movie details
async function loadMovieDetails() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`);
    const movie = await res.json();

    titleEl.textContent = movie.title;
    overviewEl.textContent = movie.overview;
    dateEl.textContent = movie.release_date;
    ratingEl.textContent = movie.vote_average;

    saveWatchHistory(movie);
  } catch (err) {
    console.error("Failed to fetch movie details:", err);
  }
}

// Load cast
async function loadMovieCast() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`);
    const data = await res.json();
    const topCast = data.cast.slice(0, 5).map(actor => actor.name).join(', ');
    castEl.innerHTML = `<p><strong>Cast:</strong> ${topCast}</p>`;
  } catch (err) {
    console.error("Failed to fetch cast:", err);
  }
}

// Load recommendations
async function loadRecommendations() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}&language=en-US`);
    const data = await res.json();

    if (!data.results.length) {
      recommendedContainer.innerHTML = "<p>No recommendations found.</p>";
      return;
    }

    data.results.slice(0, 10).forEach(movie => {
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
      recommendedContainer.appendChild(movieBox);
    });
  } catch (err) {
    recommendedContainer.innerHTML = "<p>Failed to load recommendations.</p>";
    console.error("Recommendations error:", err);
  }
}

// Save movie to watch history
async function saveWatchHistory(movie) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user._id) return;

  try {
    await fetch(`https://cinestream-v1sy.onrender.com/api/history/${user._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        releaseDate: movie.release_date
      })
    });
  } catch (err) {
    console.error("Failed to save watch history:", err);
  }
}

// Embed streaming iframe
function embedMoviePlayer() {
  if (movieId && iframe) {
    iframe.src = `https://www.2embed.cc/embed/${movieId}`;
  }
}

// Run all
embedMoviePlayer();
loadMovieDetails();
loadMovieCast();
loadRecommendations();
