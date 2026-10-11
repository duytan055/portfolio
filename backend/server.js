require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const projectRoutes = require("./routes/projectsRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const toolsskillsRoutes = require("./routes/toolsskillsRoutes");
const contactRoutes = require("./routes/contactRoutes"); // Khai báo nhất quán

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/toolsskills", toolsskillsRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
