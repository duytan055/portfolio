const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// 1 API Đăng ký tài khoản Admin
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );
    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản đã tồn tại!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
      [username, email || "admin@example.com", hashedPassword, "admin"],
    );

    res.status(201).json({
      success: true,
      message: "Tạo tài khoản Admin thành công!",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2 API Đăng nhập
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Tìm user
    const userRes = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );
    if (userRes.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không chính xác!",
      });
    }

    const user = userRes.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không chính xác!",
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" },
    );

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
