const express = require("express");
const authRouter = express.Router();

const {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile,
} = require("../controllers/userAuthent");

const {
  getProfile,
  getStats,
  updateProfile,
} = require("../controllers/profileController");

const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ---------------- AUTH ----------------
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post("/admin/register", adminMiddleware, adminRegister);
authRouter.delete("/deleteProfile", userMiddleware, deleteProfile);

// ---------------- AUTH CHECK ----------------
authRouter.get("/check", userMiddleware, (req, res) => {
  const reply = {
    firstName: req.result.firstName,
    emailId: req.result.emailId,
    _id: req.result._id,
    role: req.result.role,
  };

  res.status(200).json({
    user: reply,
    message: "Valid User",
  });
});

// ---------------- PROFILE ----------------
authRouter.get("/profile", userMiddleware, getProfile);
authRouter.get("/stats", userMiddleware, getStats);
authRouter.put("/profile", userMiddleware, updateProfile);

module.exports = authRouter;
