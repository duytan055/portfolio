const express = require("express");
const cors = require("cors");
const projectRoutes = require("./routes/projectsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
