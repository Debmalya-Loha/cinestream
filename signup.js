const baseURL = 'https://cinestream-v1sy.onrender.com/api';

document.getElementById('send-email-otp').addEventListener('click', async () => {
  const email = document.getElementById('email').value;

  try {
    const response = await fetch(`${baseURL}/otp/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    alert(data.message);
  } catch (err) {
    alert("❌ Failed to send email OTP");
  }
});

document.getElementById('verify-email-otp').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const emailOtp = document.getElementById('emailOtp').value;

  try {
    const response = await fetch(`${baseURL}/otp/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, emailOtp })
    });

    const data = await response.json();
    if (response.ok) {
      alert("✅ Email OTP verified");
    } else {
      alert("❌ Failed to verify email OTP");
    }
  } catch (err) {
    alert("❌ Error verifying email OTP");
  }
});

document.getElementById('send-sms-otp').addEventListener('click', async () => {
  const phone = document.getElementById('mobile').value;

  try {
    const response = await fetch(`${baseURL}/otp/phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    const data = await response.json();
    alert(data.message);
  } catch (err) {
    alert("❌ Failed to send mobile OTP");
  }
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const emailOtp = document.getElementById('emailOtp').value;
  const phone = document.getElementById('mobile').value;
  const phoneOtp = document.getElementById('smsOtp').value;
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;

  if (password !== confirm) {
    return alert("❌ Passwords do not match");
  }

  // Step 1: Verify Email OTP
  const emailRes = await fetch(`${baseURL}/otp/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, emailOtp })
  });
  if (!emailRes.ok) {
    return alert("❌ Email OTP verification failed");
  }

  // Step 2: Verify Phone OTP
  const phoneRes = await fetch(`${baseURL}/otp/verify-phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, phoneOtp })
  });
  if (!phoneRes.ok) {
    return alert("❌ Phone OTP verification failed");
  }

  // Step 3: Create account
  try {
    const signupRes = await fetch(`${baseURL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, mobile: phone, password })
    });

    const signupData = await signupRes.json();
    if (signupRes.ok) {
      alert("✅ Account created successfully!");
      window.location.href = "signin.html";
    } else {
      alert(`❌ ${signupData.message}`);
    }
  } catch (err) {
    alert("❌ Signup failed");
  }
});
