import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      );
    `);
    console.log("Database ready ✅");
  } catch (err) {
    console.error("Database error ❌", err);
  }
}

initDB();

app.get("/", (req, res) => {
  res.send("Admin Backend работает 🚀");
});

app.listen(PORT, () => {
  console.log("Server started 🚀");
});
