require("dotenv").config();
const express = require("express");
const cors = require("cors");

//const dashboardRoutes = require("./routes/dashboardRoutes");
const projectRoutes = require("./routes/projectsRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const toolsskillsRoutes = require("./routes/toolsskillsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

//app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/toolsskills", toolsskillsRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
