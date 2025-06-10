// ====== EMAIL OTP SENDER ======
document.getElementById('send-email-otp').addEventListener('click', async function () {
  const email = document.querySelector('input[name="email"]').value;

  if (!email) {
    alert("❗ Please enter your email first.");
    return;
  }

  try {
    const res = await fetch("https://cinestream-v1sy.onrender.com/api/otp/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, otp }),
})

    const data = await res.json();
    if (res.ok) {
      alert("✅ OTP sent to your email.");
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Failed to send OTP. Try again.");
  }
});

// ====== SMS OTP SENDER ======
document.getElementById('send-sms-otp').addEventListener('click', async function () {
  const phone = document.querySelector('input[name="mobile"]').value;

  if (!phone) {
    alert("❗ Please enter your mobile number first.");
    return;
  }

  try {
    const res = await fetch('https://cinestream-v1sy.onrender.com/api/otp/phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ OTP sent to your phone.");
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Failed to send mobile OTP. Try again.");
  }
});

//........
let otpVerified = false;

document.getElementById('signup-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const name = form.username?.value;
  const email = form.email?.value;
  const phone = form.mobile?.value;
  const password = form.password?.value;
  const confirm = form.confirm?.value;
  const emailOtp = form.emailOtp?.value;
  const phoneOtp = form.smsOtp?.value;

  if (!otpVerified) {
    try {
      const res = await fetch('https://cinestream-v1sy.onrender.com/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, emailOtp, phone, phoneOtp })
      });

      const data = await res.json();
      if (!res.ok) return alert("❌ OTP verification failed: " + data.message);

      otpVerified = true;
      alert("✅ OTP verified. Now submitting registration...");
    } catch (err) {
      alert("Server error during OTP verification.");
      return;
    }
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  // Now submit registration
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
//........

// ====== FORM SUBMIT HANDLER ======
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
