import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# Telegram Bot Token
TOKEN = '8907396342:AAEYMg4UxUeMAigZ8NPMDQSUShBdwLuyHGI'

# আপনার সঠিক Netlify লাইভ মিনি অ্যাপ লিংক
MINI_APP_URL = 'https://effortless-salamander-c36c5a.netlify.app/'
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
        f"Hello *{user_name}* - The smartest & most reliable way to earn online!\n\n"
        f"💎 Start your earning journey today! Open the app, explore daily tasks, "
        f"and withdraw real money right to your mobile wallet. Let's go! 🚀"
    )

    # ফিক্সড: এখানে WebAppInfo ব্যবহার করা হয়েছে, যা টেলিগ্রামের ভেতরেই মিনি অ্যাপ ওপেন করবে
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
