const express = require("express");
const router = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const { createRoom } = require("../controllers/collab.controller");

router.post("/create", userMiddleware, createRoom);

module.exports = router;
