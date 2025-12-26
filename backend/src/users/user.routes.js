const express = require("express");
const authenticateToken = require("../middleware/auth.middleware");
const { getMe, updateMe, listUsers } = require("./user.controller");

const router = express.Router();

router.get("/me", authenticateToken, getMe);
router.put("/me", authenticateToken, updateMe);
router.get("/", authenticateToken, listUsers);

module.exports = router;