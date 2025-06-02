document.getElementById('signup-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const name = form.username?.value;
  const email = form.email?.value;
  const phone = form.mobile?.value;
  const password = form.password?.value;
  const confirm = form.confirm?.value;

  if (!name || !email || !phone || !password || !confirm) {
    alert("Please fill out all fields.");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch('https://cinestream-v1sy.onrender.com/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Registered successfully!");
      window.location.href = 'signin.html';
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    alert("Server error. Please try again.");
    console.error(err);
  }
});
