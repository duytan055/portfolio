const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/certificates");
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
        title, 
        description, 
        image_url, 
        issued_by, 
        issue_date, 
        expiration_date, 
        credential_id, 
        credential_url
      FROM certificates ORDER BY id DESC;`;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Lỗi GET certificates:", err.message);
    res.status(500).json({ message: "❌ Lỗi máy chủ nội bộ!" });
  }
});

//2 POST
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      issued_by,
      issue_date,
      expiration_date,
      credential_id,
      credential_url,
    } = req.body;

    const imageUrl = req.file
      ? `/uploads/certificates/${req.file.filename}`
      : null;

    const query = `
      INSERT INTO certificates 
        (title, description, image_url, issued_by, issue_date, expiration_date, credential_id, credential_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`;

    const values = [
      title,
      description || "",
      imageUrl,
      issued_by,
      issue_date || null,
      expiration_date || null,
      credential_id || null,
      credential_url || null,
    ];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("🔥 Lỗi PostgreSQL:", err.message);
    res.status(500).json({ message: err.message });
  }
});

//3 PUT
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      issued_by,
      issue_date,
      expiration_date,
      credential_id,
      credential_url,
      image_url,
    } = req.body;

    if (req.file && image_url) {
      deleteFileFromDisk(image_url);
    }

    const updatedImageUrl = req.file
      ? `/uploads/certificates/${req.file.filename}`
      : image_url || null;

    const query = `
      UPDATE certificates SET 
        title = $1,
        description = $2,
        image_url = $3,
        issued_by = $4,
        issue_date = $5,
        expiration_date = $6,
        credential_id = $7,
        credential_url = $8
      WHERE id = $9 RETURNING *`;

    const values = [
      title,
      description || "",
      updatedImageUrl,
      issued_by,
      issue_date || null,
      expiration_date || null,
      credential_id || null,
      credential_url || null,
      id,
    ];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chứng chỉ để cập nhật!" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("🔥 Lỗi UPDATE certificate:", err.message);
    res.status(500).json({ message: err.message });
  }
});

//4 DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM certificates WHERE id = $1 RETURNING *`;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chứng chỉ để xóa!" });
    }

    if (rows[0].image_url) {
      deleteFileFromDisk(rows[0].image_url);
    }

    res.json({
      message: "Success !!!",
      deteleCer: rows[0],
    });
  } catch (err) {
    console.error("🔥 Lỗi DELETE certificate:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
