const express = require("express");
const cors = require("cors");
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(cors());
app.use(express.json());

// ===== НАСТРОЙКИ =====

const TOKEN = "7792270346:AAFkJWBdaCwiCYara344gK6xl-4Bd0aVadM";
const ADMIN_ID = 7817157002

// =====================

const bot = new TelegramBot(TOKEN, { polling: true });

let users = [];

// загрузка пользователей
if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json"));
}

// сохранение
function saveUsers() {
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

// пользователь написал боту
bot.onText(/\/start/, (msg) => {

    const id = msg.chat.id;

    if (!users.includes(id)) {
        users.push(id);
        saveUsers();
    }

    bot.sendMessage(id, "👋 Вы зарегистрированы!");
});

// проверка сервера
app.get("/api/health", (req, res) => {
    res.json({ status: "SERVER WORKING 🚀" });
});

// сообщение админу
app.post("/api/send", async (req, res) => {

    const text = req.body.text;

    await bot.sendMessage(ADMIN_ID, text);

    res.json({ status: "sent" });
});

// рассылка всем
app.post("/api/broadcast", async (req, res) => {

    const text = req.body.text;

    users.forEach(id => {
        bot.sendMessage(id, text).catch(()=>{});
    });

    res.json({
        status: "sent to users",
        users: users.length
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("SERVER STARTED 🚀");
});
    console.log("SERVER STARTED 🚀");
});
