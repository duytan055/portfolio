const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const [
      projectsCountRes,
      skillsCountRes,
      certificatesCountRes,
      experiencesCountRes,
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM projects"),
      pool.query("SELECT COUNT(*) FROM skills"),
      pool.query("SELECT COUNT(*) FROM certificates"),
      pool.query("SELECT COUNT(*) FROM experiences"),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProjects: parseInt(projectsCountRes.rows[0].count, 10),
        totalSkills: parseInt(skillsCountRes.rows[0].count, 10),
        totalCertificates: parseInt(certificatesCountRes.rows[0].count, 10),
        totalExperiences: parseInt(experiencesCountRes.rows[0].count, 10),
      },
    });
  } catch (error) {
    console.error("Lỗi PostgreSQL:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thống kê từ PostgreSQL",
      error: error.message,
    });
  }
});

module.exports = router;
