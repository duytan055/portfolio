const express = require("express");
const router = express.Router();
const pool = require("../db");
const path = require("path");
const fs = require("fs");

const { uploadExperience } = require("../middleware/upload");

const deleteLocalImage = (imageUrl) => {
  if (imageUrl && imageUrl.startsWith("/uploads/")) {
    const filePath = path.join(__dirname, "..", imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("🔥 Lỗi xóa file ảnh:", err.message);
        else console.log("🗑️ Đã xóa thành công file ảnh:", filePath);
      });
    }
  }
};

//1 GET
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        id, company, position, location, image_url, 
        start_date, end_date, description, is_current
      FROM experiences 
      ORDER BY id DESC;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("🔥 Lỗi GET experience:", err.message);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ!" });
  }
});

//2 POST
router.post("/", uploadExperience.single("image"), async (req, res) => {
  try {
    const {
      company,
      position,
      location,
      start_date,
      end_date,
      is_current,
      description,
    } = req.body;

    const image_url = req.file
      ? `/uploads/experiences/${req.file.filename}`
      : req.body.image_url || null;

    const finalIsCurrent = is_current === "true" || is_current === true;
    const finalEndDate = finalIsCurrent ? null : end_date || null;

    const query = `
      INSERT INTO experiences 
        (company, position, location, start_date, end_date, is_current, description, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      company,
      position,
      location || "",
      start_date || null,
      finalEndDate,
      finalIsCurrent,
      description || "",
      image_url,
    ];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("🔥 Lỗi POST experience:", err.message);
    res.status(500).json({ message: err.message });
  }
});

//3 PUT
router.put("/:id", uploadExperience.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company,
      position,
      location,
      start_date,
      end_date,
      is_current,
      description,
    } = req.body;

    const oldQuery = `SELECT image_url FROM experiences WHERE id = $1;`;
    const oldResult = await pool.query(oldQuery, [id]);

    if (oldResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy kinh nghiệm để cập nhật!" });
    }

    const oldImageUrl = oldResult.rows[0].image_url;
    let image_url = oldImageUrl;

    if (req.file) {
      deleteLocalImage(oldImageUrl);
      image_url = `/uploads/experiences/${req.file.filename}`;
    }

    const finalIsCurrent = is_current === "true" || is_current === true;
    const finalEndDate = finalIsCurrent ? null : end_date || null;

    const query = `
      UPDATE experiences SET
        company = $1,
        position = $2,
        location = $3,
        start_date = $4,
        end_date = $5,
        is_current = $6,
        description = $7,
        image_url = $8
      WHERE id = $9 
      RETURNING *;
    `;

    const values = [
      company,
      position,
      location || "",
      start_date || null,
      finalEndDate,
      finalIsCurrent,
      description || "",
      image_url,
      id,
    ];

    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (err) {
    console.error("🔥 Lỗi UPDATE experience:", err.message);
    res.status(500).json({ message: err.message });
  }
});

//4 DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM experiences WHERE id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy kinh nghiệm để xóa!" });
    }

    deleteLocalImage(rows[0].image_url);

    res.json({
      message: "Xóa kinh nghiệm thành công!",
      deleteExp: rows[0],
    });
  } catch (err) {
    console.error("🔥 Lỗi DELETE experience:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
