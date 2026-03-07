const TelegramBot = require('node-telegram-bot-api')

// вставь сюда токен из BotFather
const token = "PASTE_YOUR_TOKEN_HERE"

const bot = new TelegramBot(token, { polling: true })

// команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, "NDMIBEGINS BOT WORKING 🚀")
})
