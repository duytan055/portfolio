const express = require("express");
const router = express.Router();
const pool = require("../db");
const { route } = require("./projectsRoutes");

//1 GET
router.get("/", async (req, res) => {
  try {
    const query = `
            SELECT 
                id, 
                company, 
                position, 
                image_url, 
                start_date, 
                end_date, 
                description, 
                is_current
            FROM experiences ORDER BY id DESC;`;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Lỗi GET experience:", err.message);
    res.status(500).json({ message: "❌ Lỗi máy chủ nội bộ!" });
  }
});

//2 POST
router.post("/", async (req, res) => {
  try {
    const {
      company,
      position,
      location,
      start_date,
      end_date,
      is_current,
      desciption,
      image_url,
    } = req.body;

    const query = `
          INSERT INTO experiences 
               (company, position, location, start_date, end_date, is_current, desciption, image_url) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING*`;
    const values = [
      company,
      position,
      location,
      start_date || "",
      end_date || "",
      is_current,
      desciption || "",
      image_url,
    ];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("🔥 Lỗi PostgreSQL:", err.message);
    res.status(500).json({ message: err.message });
  }
});

//3 PUT
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company,
      position,
      location,
      start_date,
      end_date,
      is_current,
      desciption,
      image_url,
    } = req.body;

    const query = `
        UPDATE experiences SET
          company = $1,
          position = $2,
          location = $3,
          start_date =$4,
          end_date = $5,
          is_current = $6,
          description = $7,
          image_url = $8,
        WHERE id = $9 RETURNING*`;

    const values = [
      company,
      position,
      location,
      start_date || "",
      end_date || "",
      is_current,
      desciption || "",
      image_url,
      id,
    ];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No Find Experience To Update !" });
    }
    res.json(rows);
  } catch (error) {
    console.error("🔥 Lỗi UPDATE experience:", err.message);
    res.status(500).json({ message: err.message });
  }
});

//4 DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // trong ngoai try deu duoc

    const query = ` DELETE FROM experiences WHERE id = $1 RETURNING*`;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy dự án để xóa!" });
    }
    res.json({
      message: "Success !!!",
      deleteExp: rows[0],
    });
  } catch (error) {
    console.error("🔥 Lỗi DELETE experience:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
