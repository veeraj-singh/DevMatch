const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const userRoutes = require("./routes/users");
const projectRoutes = require("./routes/projects");
const matchRoutes = require("./routes/matches");

app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/match", matchRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
