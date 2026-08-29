const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

// Kết nối PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test kết nối database
pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database connected successfully");
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    message: "Portfolio API is running",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
