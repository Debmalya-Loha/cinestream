document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "signin.html";
    return;
  }

  // Set user profile details
  document.getElementById("profile-icon").textContent = user.username[0].toUpperCase();
  document.getElementById("username").textContent = user.username;
  document.getElementById("email").textContent = user.email;
  document.getElementById("phone").textContent = user.phone;

  // Load watch history
  fetch(`https://cinestream-v1sy.onrender.com/api/history/${user._id}`)
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("watch-history");
      container.innerHTML = "";

      if (!data.history || data.history.length === 0) {
        container.innerHTML = "<p style='color: gray;'>No watch history found.</p>";
        return;
      }

      data.history.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.className = "movie-card";
        movieCard.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          <p>${movie.title}</p>
        `;
        container.appendChild(movieCard);
      });
    })
    .catch((err) => {
      console.error("Failed to load watch history", err);
    });
});

// Sign Out
function signOut() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
