import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, ContextTypes

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

# ১. /start কমান্ডের ফাংশন
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_name = update.effective_user.first_name or "User"
    
    welcome_message = (
        f"Hello *{user_name}* - The smartest & most reliable way to earn online!\n\n"
        f"💎 Start your earning journey today! Open the app, explore daily tasks, "
        f"and withdraw real money right to your mobile wallet. Let's go! 🚀"
    )

    # এখানে কোনো সরাসরি লিংক নেই, 'callback_data' ব্যবহার করা হয়েছে যা কমান্ডের মতো কাজ করবে
    keyboard = [
        [InlineKeyboardButton("🚀 Open App", callback_data="open_app_command")],
        [InlineKeyboardButton("📢 Join NexaEarn Channel", url=CHANNEL_URL)]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        text=welcome_message,
        parse_mode='Markdown',
        reply_markup=reply_markup
    )

# ২. বাটন ক্লিক হ্যান্ডলার (যা কমান্ডের কাজ করবে এবং মিনি অ্যাপ কল করবে)
async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    # যদি ব্যবহারকারী 'Open App' বাটনে ক্লিক করে
    if query.data == "open_app_command":
        # এখানে বট কমান্ডের মাধ্যমে মিনি অ্যাপ পেজটি ইউজারের সামনে কল করছে
        keyboard = InlineKeyboardMarkup([
            [InlineKeyboardButton("📲 Click Here to Launch App", web_app=WebAppInfo(url=MINI_APP_URL))]
        ])
        await query.message.reply_text(
            text="👇 Click the button below to launch your NexaEarn App:",
            reply_markup=keyboard
        )

def main():
    # Application তৈরি করা
    application = ApplicationBuilder().token(TOKEN).build()

    # /start কমান্ড হ্যান্ডলার রেজিস্টার করা
    application.add_handler(CommandHandler("start", start))
    
    # বাটন ক্লিক (Callback Query) হ্যান্ডলার রেজিস্টার করা
    application.add_handler(CallbackQueryHandler(button_handler))

    # বট রান করা (Polling)
    print("🤖 Python Telegram Bot is successfully running online...")
    application.run_polling()

if __name__ == '__main__':
    main()
