export default async function handler(req, res) {
  // বটের টোকেন সরাসরি কোডে না রেখে Vercel-এর Environment Variable থেকে নেওয়া হচ্ছে
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

  if (req.method === 'POST') {
    const update = req.body;

    // চেক করা হচ্ছে মেসেজ এসেছে কি না
    if (update && update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;
      
      // ইউজারের ফুল নেম বের করা
      const firstName = update.message.from.first_name || 'User';
      const lastName = update.message.from.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();

      // যদি ইউজার /start কমান্ড দেয়
      if (text === '/start') {
        const welcomeMessage = `Welcome to ${fullName} our bot\n\nChoose an app below to get started. You can also use the ☰ menu button next to the message box anytime.`;

        // ইনলাইন বাটনগুলোর ডিজাইন
        const replyMarkup = {
          inline_keyboard: [
            [
              { 
                text: '⚡ Open NexGen Platform 2.0', 
                web_app: { url: 'https://srnxgen.netlify.app' } 
              }
            ],
            [
              { 
                text: '💬 Support', 
                url: 'https://t.me/nexaearn_support' 
              },
              { 
                text: '👤 Contact', 
                url: 'https://t.me/NexaEarn_admin' 
              }
            ]
          ]
        };

        // টেলিগ্রামে মেসেজ পাঠানোর রিকোয়েস্ট
        await fetch(`${TELEGRAM_API}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: welcomeMessage,
            reply_markup: replyMarkup
          })
        });
      }
    }

    return res.status(200).json({ status: 'success' });
  }

  return res.status(200).json({ message: 'NexGen Bot is running smoothly on Vercel!' });
}

