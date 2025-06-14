document.getElementById('signin-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;

  try {
    const res = await fetch('https://cinestream-v1sy.onrender.com/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Save user info to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      alert("✅ Sign in successful!");

      const redirect = localStorage.getItem('redirectAfterLogin') || 'index.html';
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = redirect;
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Server error");
  }
});
