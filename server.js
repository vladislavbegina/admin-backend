const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send("Сервер работает 🚀 Время БД: " + result.rows[0].now);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

app.listen(port, () => {
  console.log("Server started on port " + port);
});
