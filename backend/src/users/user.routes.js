const express = require("express");
const authenticateToken = require("../middleware/auth.middleware");
const { getMe, updateMe } = require("./user.controller");

const router = express.Router();

router.get("/me", authenticateToken, getMe);
router.put("/me", authenticateToken, updateMe);

module.exports = router;