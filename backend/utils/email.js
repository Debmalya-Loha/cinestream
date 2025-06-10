const mailjet = require('node-mailjet');

const mailjetClient = mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

async function sendOtpEmail(to, otp) {
  try {
    const result = await mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "debmalya811@gmail.com",
              Name: "CineStream"
            },
            To: [{ Email: to, Name: "User" }],
            Subject: "CineStream Email OTP",
            TextPart: `Your CineStream OTP is: ${otp}`,
            HTMLPart: `<h3>Your CineStream OTP is: <strong>${otp}</strong></h3>`
          }
        ]
      });

    console.log("✅ Email sent:", result.body);
    return result.body;
  } catch (err) {
    console.error("❌ Mailjet error:", err);
    throw err;
  }
}

module.exports = sendOtpEmail;
