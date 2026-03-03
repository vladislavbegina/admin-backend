const express = require("express");
const app = express();

app.use(express.json());

// Главная страница
app.get("/", (req, res) => {
  res.send(`
    <h1>Admin Begins 🚀</h1>
    <button onclick="test()">Проверить API</button>

    <script>
      function test() {
        fetch('/api')
          .then(res => res.json())
          .then(data => alert(data.message));
      }
    </script>
  `);
});

// API
app.get("/api", (req, res) => {
  res.json({ message: "Сервер работает ✅" });
});

// ВАЖНО ДЛЯ RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
