const express = require("express");
const cors = require("cors");

const authRoutes = require("./auth/auth.routes");
const userRoutes = require("./users/user.routes");
const messageRoutes = require("./messages/message.routes");

const app = express();

app.use(cors());
app.use(express.json());

// ROTAS PÚBLICAS
app.use("/api/auth", authRoutes);

// ROTAS PROTEGIDAS
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Messaging App API is running" });
});

module.exports = app;