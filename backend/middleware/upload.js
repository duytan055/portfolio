const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createUploader = (folderName) => {
  const uploadDir = path.join(__dirname, `../uploads/${folderName}`);

  // Tự động tạo thư mục con nếu chưa tồn tại
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  return multer({ storage });
};

module.exports = {
  uploadProject: createUploader("projects"),
  uploadCertificate: createUploader("certificates"),
  uploadToolsSkill: createUploader("toolsskills"),
  uploadExperience: createUploader("experiences"),
};
