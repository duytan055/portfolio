const exrpess = require("express");
const router = exrpess.Router();
const pool = require("../db");

// 1. GET: Lấy danh sách chứng chỉ
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
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      image_url,
      issued_by,
      issue_date,
      expiration_date,
      credential_id,
      credential_url,
    } = req.body;

    const query = `
        INSERT INTO certificates 
            (title, description, image_url, issued_by, issue_date, expiration_date, credential_id, credential_url)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING*`;
    const values = [
      title,
      description || "",
      image_url,
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
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      image_url,
      issued_by,
      issue_date,
      expiration_date,
      credential_id,
      credential_url,
    } = req.body;

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
        WHERE id = $9 RETURNING*`;
    const values = [
      title,
      description || "",
      image_url,
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
        .json({ message: "No Find Certificate To Update !" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("🔥 Lỗi UPDATE certificate:", err.message);
    res.status(500).json({ message: err.message });
  }
});

//4 DETELE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM certificates WHERE id = $1 RETURNING*`;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chứng chỉ để xóa!" });
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
