import express from "express";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 10000;
const SECRET = process.env.JWT_SECRET || "supersecretkey";

app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ================= DATABASE INIT =================
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    );
  `);

  // создаём первого admin автоматически
  const adminCheck = await pool.query(
    "SELECT * FROM users WHERE role='admin'"
  );

  if (adminCheck.rows.length === 0) {
    const hashed = await bcrypt.hash("admin123", 10);
    await pool.query(
      "INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4)",
      ["Admin", "admin@admin.com", hashed, "admin"]
    );
    console.log("Default admin created ✅");
  }

  console.log("Database ready ✅");
}

initDB();

// ================= AUTH =================
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Access denied" });
  next();
}

// ================= ROUTES =================

app.get("/", (req, res) => {
  res.send("Backend PRO MAX работает 🚀");
});

// регистрация
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "INSERT INTO users (name,email,password) VALUES ($1,$2,$3)",
      [name, email, hashed]
    );
    res.json({ message: "User registered ✅" });
  } catch {
    res.status(400).json({ error: "User already exists" });
  }
});

// логин
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0)
    return res.status(400).json({ error: "User not found" });

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

// пользовательская панель
app.get("/dashboard", auth, (req, res) => {
  res.json({
    message: "Добро пожаловать 🔥",
    user: req.user,
  });
});

// админ список пользователей
app.get("/admin/users", auth, adminOnly, async (req, res) => {
  const users = await pool.query(
    "SELECT id,name,email,role FROM users"
  );
  res.json(users.rows);
});

// удаление пользователя
app.delete("/admin/users/:id", auth, adminOnly, async (req, res) => {
  await pool.query("DELETE FROM users WHERE id=$1", [
    req.params.id,
  ]);
  res.json({ message: "User deleted ✅" });
});

app.listen(PORT, () => {
  console.log("Server started 🚀");
});
