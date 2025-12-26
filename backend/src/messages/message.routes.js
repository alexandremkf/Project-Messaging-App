const express = require("express");
const authenticateToken = require("../middleware/auth.middleware");
const { sendMessage, getMessagesWithUser } = require("./message.controller");

const router = express.Router();

router.post("/", authenticateToken, sendMessage);
router.get("/:userId", authenticateToken, getMessagesWithUser);

module.exports = router;