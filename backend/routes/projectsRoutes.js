const express = require("express");
const router = express.Router();
const pool = require("../db");
const { uploadProject } = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

const createSlug = (str) => {
  return (str || "du-an-moi")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/^-+|-+$/g, "");
};

const generateUniqueSlug = async (title, currentId = null) => {
  let slug = createSlug(title);
  let query = "SELECT id FROM projects WHERE slug = $1";
  let params = [slug];

  if (currentId) {
    query += " AND id != $2";
    params.push(currentId);
  }

  const { rows } = await pool.query(query, params);

  if (rows.length > 0) {
    slug = `${slug}-${Date.now()}`;
  }

  return slug;
};

const parseTechArray = (tech) => {
  if (Array.isArray(tech)) return tech;
  if (typeof tech === "string" && tech.trim() !== "") {
    return tech
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const parseBoolean = (val, defaultValue = true) => {
  if (val === undefined || val === null || val === "") return defaultValue;
  if (val === "true" || val === true || val === "1" || val === 1) return true;
  if (val === "false" || val === false || val === "0" || val === 0)
    return false;
  return defaultValue;
};

// 1 GET
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        title, 
        slug,
        short_description,
        description,
        key_features,
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

// 2 POST
router.post("/", uploadProject.single("image"), async (req, res) => {
  try {
    const {
      title,
      short_description,
      description,
      key_features,
      technologies,
      github_url,
      demo_url,
      is_featured,
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ message: "Tên dự án (title) không được để trống!" });
    }

    const imageUrl = req.file ? `/uploads/projects/${req.file.filename}` : "";
    const techArray = parseTechArray(technologies);
    const featureArray = parseTechArray(key_features);
    const isFeaturedBool = parseBoolean(is_featured, true);

    const slug = await generateUniqueSlug(title);

    const query = `
      INSERT INTO projects (
        title, 
        slug, 
        short_description, 
        description, 
        key_features,
        image_url, 
        technologies, 
        github_url, 
        demo_url, 
        is_featured
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [
      title,
      slug,
      short_description || "",
      description || "",
      featureArray,
      imageUrl,
      techArray,
      github_url || "",
      demo_url || "",
      isFeaturedBool,
    ];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("🔥 Lỗi PostgreSQL POST project:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// 3 PUT
router.put("/:id", uploadProject.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      short_description,
      description,
      key_features,
      image_url,
      technologies,
      github_url,
      demo_url,
      is_featured,
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ message: "Tên dự án (title) không được để trống!" });
    }

    const finalImageUrl = req.file
      ? `/uploads/projects/${req.file.filename}`
      : image_url || "";
    const techArray = parseTechArray(technologies);
    const featureArray = parseTechArray(key_features);
    const isFeaturedBool = parseBoolean(is_featured, true);

    const slug = await generateUniqueSlug(title, id);

    const query = `
      UPDATE projects SET 
        title = $1,
        slug = $2,
        short_description = $3,
        description = $4,
        key_features = $5,
        image_url = $6,
        technologies = $7,
        github_url = $8,
        demo_url = $9,
        is_featured = $10
      WHERE id = $11
      RETURNING *;
    `;

    const values = [
      title,
      slug,
      short_description || "",
      description || "",
      featureArray,
      finalImageUrl,
      techArray,
      github_url || "",
      demo_url || "",
      isFeaturedBool,
      id,
    ];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy dự án để cập nhật!" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("🔥 Lỗi UPDATE project:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// 4 DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `DELETE FROM projects WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy dự án để xóa!" });
    }

    const deletedProject = rows[0];

    if (
      deletedProject.image_url &&
      deletedProject.image_url.startsWith("/uploads/")
    ) {
      const filePath = path.join(__dirname, "..", deletedProject.image_url);

      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err)
            console.error("🔥 Lỗi xóa file ảnh trên server:", err.message);
          else console.log("🗑️ Đã xóa thành công file ảnh:", filePath);
        });
      }
    }

    res.json({
      message: "Xóa dự án và ảnh thành công!",
      deletedProject,
    });
  } catch (err) {
    console.error("🔥 Lỗi DELETE project:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
