const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const admin = require('firebase-admin');

// Firebase Admin SDK Configuration (Download serviceAccountKey.json from Firebase Console -> Project Settings -> Service Accounts)
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nexagen-313cd-default-rtdb.firebaseio.com"
});

const app = express();
app.use(express.json());
app.use(cors());

// Temporary memory store for OTPs
const otpStore = {};

// Configure Nodemailer with your Gmail account & App Password
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_GMAIL@gmail.com',         // Your Gmail
        pass: 'YOUR_GMAIL_APP_PASSWORD'     // Gmail App Password (not your main password)
    }
});

// 1. API to Send OTP
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;
    if(!email) return res.json({ success: false, message: 'Email is required' });

    // Generate random 6 digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 2 minutes expiry
    otpStore[email] = {
        otp: otp,
        expiresAt: Date.now() + 2 * 60 * 1000 
    };

    const mailOptions = {
        from: 'NexaGen-SR <noreply@nexagen.com>',
        to: email,
        subject: 'NexaGen-SR Login Verification Code',
        text: `Your verification code is: ${otp}. This code is valid for 2 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Failed to send email' });
    }
});

// 2. API to Verify OTP and generate Firebase Custom Token
app.post('/api/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    
    const record = otpStore[email];
    if(!record) return res.json({ success: false, message: 'Please request a new code.' });

    if(Date.now() > record.expiresAt) {
        delete otpStore[email];
        return res.json({ success: false, message: 'Code has expired. Please request a new one.' });
    }

    if(record.otp !== otp) {
        return res.json({ success: false, message: 'Incorrect verification code.' });
    }

    // Clear OTP after success
    delete otpStore[email];

    try {
        // Check if user exists in Firebase, otherwise create user
        let uid = email.replace(/[^a-zA-Z0-9]/g, '_');
        try {
            await admin.auth().getUser(uid);
        } catch (err) {
            await admin.auth().createUser({ uid: uid, email: email });
        }

        // Generate Firebase Custom Token
        const token = await admin.auth().createCustomToken(uid);
        res.json({ success: true, token: token });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Authentication error.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
