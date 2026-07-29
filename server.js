const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// মিডলওয়্যার (CORS এবং JSON ডাটা রিড করার জন্য)
app.use(cors());
app.use(express.json());

// ১. রুট বা হোম পেজ (ব্রাউজারে ভিজিট করলে আর Cannot GET / দেখাবে না)
app.get('/', (req, res) => {
    res.status(200).json({ 
        status: 'online', 
        message: 'Nexagen-SR Backend Server is running successfully!' 
    });
});

// ২. কোড পাঠানোর জন্য POST রাউট
app.post('/send-code', (req, res) => {
    const { email } = req.body;

    // ইমেইল চেক করা
    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email is required!' 
        });
    }

    // ৪ ডিজিটের একটি ভেরিফিকেশন কোড তৈরি করা
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    // কনসোলে প্রিন্ট হবে (আপনার রেন্ডার লগ থেকে দেখতে পাবেন)
    console.log(`Verification code for ${email}: ${verificationCode}`);

    // এখানে আপনি Nodemailer বা অন্য কোনো ইমেইল সার্ভিস যুক্ত করতে পারেন।
    // আপাতত অ্যাপ টেস্ট করার জন্য সাকসেস রেসপন্স পাঠানো হচ্ছে:
    res.status(200).json({ 
        success: true, 
        message: 'Code sent successfully!',
        code: verificationCode // টেস্টিংয়ের সুবিধার জন্য রেসপন্সে কোড পাঠানো হলো
    });
});

// সার্ভার স্টার্ট করা
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
