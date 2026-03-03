const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// Подключение к PostgreSQL (Render автоматически передает DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Создание таблицы если нет
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL
    );
  `);
  console.log("Database ready ✅");
}

initDB();

// Главная страница
app.get("/", (req, res) => {
  res.send(`
    <h1>Admin Begins 🚀</h1>

    <h3>Регистрация</h3>
    <input id="username" placeholder="Логин"><br><br>
    <input id="password" type="password" placeholder="Пароль"><br><br>
    <button onclick="register()">Зарегистрироваться</button>

    <script>
      async function register() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const res = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        alert(data.message);
      }
    </script>
  `);
});

// API регистрации
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, password]
    );
    res.json({ message: "Пользователь создан ✅" });
  } catch (err) {
    res.json({ message: "Ошибка или пользователь уже существует ❌" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
