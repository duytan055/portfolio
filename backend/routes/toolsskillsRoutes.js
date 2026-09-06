const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/toolsskills");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const deleteFileFromDisk = (relativeUrl) => {
  if (!relativeUrl || relativeUrl.startsWith("http")) return;

  const cleanPath = relativeUrl.startsWith("/")
    ? relativeUrl.slice(1)
    : relativeUrl;
  const filePath = path.join(__dirname, "..", cleanPath);

  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("🔥 Lỗi xóa tệp ảnh trên ổ đĩa:", err.message);
    }
  });
};

//1 GET
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

//2 POST
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Tên kỹ năng không được để trống!" });
    }

    const imageUrl = req.file
      ? `/uploads/toolsskills/${req.file.filename}`
      : null;

    const query = `
      INSERT INTO skills 
        (name, description, image_url)
      VALUES ($1, $2, $3)
      RETURNING *`;

    const values = [name, description || "", imageUrl];
    const { rows } = await pool.query(query, values);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("🔥 Lỗi POST skill:", err.message);
    res.status(500).json({ message: err.message });
  }
});

//3 PUT
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Tên kỹ năng không được để trống!" });
    }

    if (req.file && image_url) {
      deleteFileFromDisk(image_url);
    }

    const updatedImageUrl = req.file
      ? `/uploads/toolsskills/${req.file.filename}`
      : image_url || null;

    const query = `
      UPDATE skills SET 
        name = $1,
        description = $2,
        image_url = $3
      WHERE id = $4
      RETURNING *`;

    const values = [name, description || "", updatedImageUrl, id];

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

    if (rows[0].image_url) {
      deleteFileFromDisk(rows[0].image_url);
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
