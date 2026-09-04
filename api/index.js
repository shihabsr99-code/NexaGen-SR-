export default async function handler(req, res) {
  // Environment Variable থেকে টোকেন নেওয়া
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

  if (req.method === 'POST') {
    const update = req.body;

    if (update && update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;
      
      const firstName = update.message.from.first_name || 'User';
      const lastName = update.message.from.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();

      // যদি ইউজার /start কমান্ড দেয়
      if (text === '/start') {
        // স্ক্রিনশটের মতো প্রিমিয়াম স্টাইল মেসেজ
        const welcomeMessage = 
          `<blockquote>👋 <b>Hello, ${fullName}! ❞</b></blockquote>\n\n` +
          `<blockquote>Welcome to <b>NexGen Platform Bot</b>. Choose an app below to get started or use the ☰ menu button anytime. ❞</blockquote>`;

        // ইনলাইন বাটন ডিজাইন
        const replyMarkup = {
          inline_keyboard: [
            [
              { 
                text: '💫 NexGen Platform 2.0', 
                web_app: { url: 'https://srnxgen.netlify.app' } 
              }
            ],
            [
              { 
                text: '💬 Support', 
                url: 'https://t.me/nexaearn_support' 
              },
              { 
                text: '✨ Open App 2.0', 
                url: 'https://t.me/EarnCash_pro_bot/myapp' 
              }
            ]
          ]
        };

        // টেলিগ্রামে মেসেজ পাঠানো
        try {
          await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: welcomeMessage,
              parse_mode: 'HTML',
              reply_markup: replyMarkup
            })
          });
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    }

    return res.status(200).json({ status: 'success' });
  }

  return res.status(200).json({ message: 'NexGen Bot is running smoothly on Vercel!' });
}
