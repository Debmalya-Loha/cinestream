const baseURL = 'https://cinestream-v1sy.onrender.com/api';

const sendBtn = document.getElementById('send-email-otp');
const verifyBtn = document.getElementById('verify-email-otp');
const registerBtn = document.querySelector('button[type="submit"]');
const timerSpan = document.getElementById('otp-timer');
const statusSpan = document.getElementById('email-otp-status');
const emailInput = document.getElementById('email');
const otpInput = document.getElementById('emailOtp');

let otpVerified = false;
let otpTimerInterval;
let timeLeft = 0;

// Initially disable Register
registerBtn.disabled = true;

// Start OTP Timer
function startOTPTimer() {
  clearInterval(otpTimerInterval);
  timeLeft = 300; // 5 minutes
  sendBtn.disabled = true;
  updateTimer();

  otpTimerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(otpTimerInterval);
      sendBtn.disabled = false;
      timerSpan.textContent = "You can resend OTP.";
    }
  }, 1000);
}

// Show countdown
function updateTimer() {
  const m = Math.floor(timeLeft / 60);
  const s = String(timeLeft % 60).padStart(2, '0');
  timerSpan.textContent = ` (${m}:${s})`;
}

// Send OTP
sendBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  if (!email) return alert("❗Please enter email first");

  try {
    const response = await fetch(`${baseURL}/otp/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    alert(data.message);
    startOTPTimer();
    otpVerified = false;
    registerBtn.disabled = true;
    statusSpan.textContent = '';
    statusSpan.style.color = '';
  } catch (err) {
    alert("❌ Failed to send email OTP");
  }
});

// Verify OTP
verifyBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  const emailOtp = otpInput.value;

  if (!email || !emailOtp) return alert("❗Please fill email and OTP");

  try {
    const response = await fetch(`${baseURL}/otp/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, emailOtp })
    });

    const data = await response.json();
    if (response.ok) {
      otpVerified = true;
      registerBtn.disabled = false;
      statusSpan.textContent = "✅ Verified";
      statusSpan.style.color = "lightgreen";
      alert("✅ Email OTP verified");

      // Disable fields after verification
      emailInput.disabled = true;
      otpInput.disabled = true;
      sendBtn.disabled = true;
      verifyBtn.disabled = true;
      clearInterval(otpTimerInterval);
      timerSpan.textContent = ""; // Hide timer
    } else {
      otpVerified = false;
      registerBtn.disabled = true;
      statusSpan.textContent = "❌ Invalid OTP";
      statusSpan.style.color = "red";
      alert("❌ Failed to verify email OTP");
    }
  } catch (err) {
    alert("❌ Error verifying email OTP");
  }
});

// Final Signup Submit
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const email = emailInput.value;
  const emailOtp = otpInput.value;
  const phone = document.getElementById('mobile').value;
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;

  if (!otpVerified) return alert("❌ Please verify your email first");
  if (password !== confirm) return alert("❌ Passwords do not match");

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
