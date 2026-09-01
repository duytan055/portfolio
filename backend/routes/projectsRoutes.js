const express = require("express");
const router = express.Router();
const pool = require("../db");

// 1. GET: Lấy danh sách dự án
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        title, 
        slug,
        short_description,
        description,
        image_url,
        githun_url,
        demo_url,
        technologies,
        is_featured
      FROM projects 
      ORDER BY id DESC;
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Lỗi GET projects:", err.message);
    res.status(500).json({ message: "❌ Lỗi máy chủ nội bộ!" });
  }
});

// 2. POST: Thêm dự án mới
router.post("/", async (req, res) => {
  // Hứng dữ liệu chuẩn snake_case từ React Admin.jsx
  const {
    title,
    short_description,
    description,
    image_url,
    githun_url,
    demo_url,
    technologies,
    is_featured,
  } = req.body;

  // Kiểm tra trường bắt buộc
  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "❌ Thiếu tên dự án hoặc mô tả chi tiết!" });
  }

  // Tự động tạo slug
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  try {
    const query = `
      INSERT INTO projects (
        title, 
        short_description, 
        description, 
        image_url, 
        githun_url, 
        demo_url, 
        technologies, 
        is_featured, 
        slug
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *;
    `;

    const values = [
      title,
      short_description || null,
      description,
      image_url || null,
      githun_url || null,
      demo_url || null,
      technologies || [],
      is_featured || false,
      slug,
    ];

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      message: "✅ Dự án mới đã được thêm thành công!",
      project: rows[0],
    });
  } catch (err) {
    console.error("🔥 Lỗi PostgreSQL:", err.message);
    res.status(500).json({ message: `❌ Lỗi CSDL: ${err.message}` });
  }
});

module.exports = router;
