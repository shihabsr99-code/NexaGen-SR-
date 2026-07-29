const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

const app = express();

// 1. ALL Origins Allow Korar Jonno CORS Middleware Add Kora Hoeyche
app.use(cors({ origin: '*' }));
app.use(express.json());

// Firebase Admin SDK Config
// (Tomar Firebase Console > Project Settings > Service Accounts theke JSON key download kore use korbe)
const serviceAccount = require('./serviceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nexagen-313cd-default-rtdb.firebaseio.com"
});

// Temporary In-Memory Store for OTP
const otpStore = {};

// Gmail Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-gmail@gmail.com', // Tomar official Gmail ID
    pass: 'your-app-password'     // Gmail App Password (Not regular password)
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ status: "online", message: "NexaGen-SR Backend Server is running successfully!" });
});

// 2. API: Send OTP
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expiresAt: Date.now() + 2 * 60 * 1000 }; // 2 mins validity

  const mailOptions = {
    from: '"NexaGen-SR Messenger" <your-gmail@gmail.com>',
    to: email,
    subject: 'Your NexaGen-SR Verification Code',
    text: `Your OTP verification code is: ${otp}. It will expire in 2 minutes.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false, message: "Failed to send email OTP." });
  }
});

// 3. API: Verify OTP & Generate Firebase Custom Token
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ success: false, message: "No OTP request found for this email." });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP code." });
  }

  // OTP match hole delete kore dao
  delete otpStore[email];

  try {
    // Check or Create User in Firebase Auth
    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
    } catch (e) {
      user = await admin.auth().createUser({ email });
    }

    // Create Firebase Custom Auth Token
    const customToken = await admin.auth().createCustomToken(user.uid);
    res.json({ success: true, token: customToken });
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({ success: false, message: "Firebase Token generation failed." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
