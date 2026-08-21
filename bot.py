import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# Telegram Bot Token
TOKEN = '8907396342:AAEYMg4UxUeMAigZ8NPMDQSUShBdwLuyHGI'

# আপনার মিনি অ্যাপের লাইভ লিংক এখানে বসাবেন (যেমন Firebase বা Vercel লিংক)
MINI_APP_URL = 'https://your-mini-app-url.com'
CHANNEL_URL = 'https://t.me/NexaEarn_Channel'

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_name = update.effective_user.first_name or "User"
    
    welcome_message = (
        f"🔥 Welcome to NexaEarn Official Bot 🛡️\n"
        f"Hello *{user_name}*! The smartest & most reliable way to earn online!\n\n"
        f"✅ Watch daily ads & earn rewards.\n"
        f"✅ Complete verified social tasks.\n"
        f"✅ Invite friends for huge bonuses & 30% commission.\n"
        f"✅ Instant crypto & mobile banking withdrawals.\n\n"
        f"🎧 24/7 Dedicated Support.\n"
        f"🌐 Secure, automated & trusted platform.\n\n"
        f"📲 Click 'Open App' below & start making money now! 🚀"
    )

    # Inline Keyboards (Open App via WebApp & Join Channel via URL)
    keyboard = [
        [InlineKeyboardButton("🚀 Open App", web_app=WebAppInfo(url=MINI_APP_URL))],
        [InlineKeyboardButton("📢 Join NexaEarn Channel", url=CHANNEL_URL)]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        text=welcome_message,
        parse_mode='Markdown',
        reply_markup=reply_markup
    )

def main():
    # Application তৈরি করা
    application = ApplicationBuilder().token(TOKEN).build()

    # /start কমান্ড হ্যান্ডলার রেজিস্টার করা
    application.add_handler(CommandHandler("start", start))

    # বট রান করা (Polling)
    print("🤖 Python Telegram Bot is successfully running online...")
    application.run_polling()

if __name__ == '__main__':
    main()
