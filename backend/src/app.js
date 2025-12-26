const express = require("express");
const cors = require("cors");

const authRoutes = require("./auth/auth.routes");
const userRoutes = require("./users/user.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Messaging App API is running" });
});

module.exports = app;