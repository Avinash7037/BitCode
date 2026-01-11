const express = require("express");
const router = express.Router();
const userMiddleware = require("../middleware/userMiddleware");

const {
  getProfile,
  getStats,
  updateProfile,
} = require("../controllers/profileController");

router.get("/profile", userMiddleware, getProfile);
router.get("/stats", userMiddleware, getStats);
router.put("/profile", userMiddleware, updateProfile);

module.exports = router;
