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

module.exports = router;
