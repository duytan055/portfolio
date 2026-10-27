const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");


// 1 API Đăng nhập
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
