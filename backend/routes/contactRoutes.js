const express = require("express");
const router = express.Router();
const db = require("../db");

const sendTelegramNotification = async (name, email, subject, message) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn(
        "⚠️ Chưa cấu hình TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trong .env",
      );
      return;
    }

    const text = `📬 TIN NHẮN MỚI TỪ PORTFOLIO\n\n👤 Họ tên: ${name}\n📧 Email: ${email}\n📌 Chủ đề: ${subject || "Không có"}\n💬 Nội dung:\n${message}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });
  } catch (err) {
    console.error("⚠️ Lỗi gửi Telegram:", err.message);
  }
};

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ các thông tin bắt buộc.",
    });
  }

  try {
    const query =
      "INSERT INTO contacts (name, email, subject, message, created_at) VALUES ($1, $2, $3, $4, NOW())";
    const values = [name, email, subject || "", message];

    await db.query(query, values);

    sendTelegramNotification(name, email, subject, message);

    return res.status(200).json({
      success: true,
      message: "Gửi tin nhắn thành công!",
    });
  } catch (error) {
    console.error("❌ Lỗi CSDL / Server:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi máy chủ.",
    });
  }
});

module.exports = router;
