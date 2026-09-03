const express = require("express");
const router = express.Router();
const pool = require("../db");

// 1. GET: Lấy danh sách kỹ năng
router.get("/", async (req, res) => {
  try {
    const query = `
            SELECT
                id,
                name,
                description,
                image_url,
            FROM skills ORDER BY id DESC;`;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Lỗi GET skills:", err.message);
    res.status(500).json({ message: "❌ Lỗi máy chủ nội bộ!" });
  }
});

module.exports = router;
