const express = require("express");
const router = express.Router();
const pool = require("../db");

// 1 GET
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT
        id,
        name,
        description,
        image_url
      FROM skills ORDER BY id DESC;`;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Lỗi GET skills:", err.message);
    res.status(500).json({ message: "❌ Lỗi máy chủ nội bộ!" });
  }
});

// 2 POST
router.post("/", async (req, res) => {
  try {
    const { name, description, image_url } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Tên kỹ năng không được để trống!" });
    }

    const query = `
      INSERT INTO skills 
        (name, description, image_url)
      VALUES ($1, $2, $3)
      RETURNING *`;

    const values = [name, description || "", image_url || null];
    const { rows } = await pool.query(query, values);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("🔥 Lỗi POST skill:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// 3 PUT
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Tên kỹ năng không được để trống!" });
    }

    const query = `
      UPDATE skills SET 
        name = $1,
        description = $2,
        image_url = $3
      WHERE id = $4
      RETURNING *`;

    const values = [name, description || "", image_url || null, id];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy kỹ năng để cập nhật!" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("🔥 Lỗi UPDATE skill:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// 4 DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM skills WHERE id = $1 RETURNING *`;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy kỹ năng để xóa!" });
    }

    res.json({
      message: "Xóa kỹ năng thành công!",
      deletedSkill: rows[0],
    });
  } catch (err) {
    console.error("🔥 Lỗi DELETE skill:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
