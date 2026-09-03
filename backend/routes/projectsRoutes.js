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
        github_url,
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
  try {
    const {
      title,
      short_description,
      description,
      image_url,
      technologies,
      github_url,
      demo_url,
    } = req.body;

    let techArray = [];
    if (Array.isArray(technologies)) {
      techArray = technologies;
    } else if (typeof technologies === "string" && technologies.trim() !== "") {
      techArray = technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    const createSlug = (str) => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/([^0-9a-z-\s])/g, "")
        .replace(/(\s+)/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    const slug = createSlug(title || "du-an-moi");

    const query = `
      INSERT INTO projects (title, slug, short_description, description, image_url, technologies, github_url, demo_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      title,
      slug,
      short_description || "",
      description || "",
      image_url || "",
      techArray,
      github_url || "",
      demo_url || "",
    ];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("🔥 Lỗi PostgreSQL:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// 3. PUT: Sửa dự án
router.put("/:id", async (req, res) => {
  // <-- SỬA LỖI 1: Đổi " :/id " thành " /:id "
  try {
    const { id } = req.params;
    const {
      title,
      short_description,
      description,
      image_url,
      technologies,
      github_url,
      demo_url,
    } = req.body;

    let techArray = [];
    if (Array.isArray(technologies)) {
      techArray = technologies;
    } else if (typeof technologies === "string" && technologies.trim() !== "") {
      // <-- SỬA LỖI 2: Đổi techArray.split() thành technologies.split()
      techArray = technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    const createSlug = (str) => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/([^0-9a-z-\s])/g, "")
        .replace(/(\s+)/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    const slug = createSlug(title || "du-an-moi");

    const query = `
      UPDATE projects SET 
        title = $1,
        slug = $2,
        short_description = $3,
        description = $4,
        image_url = $5,
        technologies = $6,
        github_url = $7,
        demo_url = $8
      WHERE id = $9
      RETURNING *;
    `; // <-- SỬA LỖI 3 & 4: Sửa sai chính tả 'short_desciption' thành 'short_description' và thêm '*' sau RETURNING

    const values = [
      title,
      slug,
      short_description || "",
      description || "",
      image_url || "",
      techArray,
      github_url || "",
      demo_url || "",
      id,
    ];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No Find Project To Update !" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("🔥 Lỗi UPDATE project:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// 4/ DELETE: Xóa dự án
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `DELETE FROM projects WHERE id = $1 RETURNING*`;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy dự án để xóa!" });
    }
    res.json({
      message: " Xóa thành công !!!",
      deletedProject: rows[0],
    });
  } catch (err) {
    console.error("🔥 Lỗi DELETE project:", err.message);
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
